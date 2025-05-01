// Defines "Fetch leaning content" API Logic
const Content = require('../models/Content');
const User = require('../models/User');

const addContent = async(req, res) =>{
    const {title, type, contentText, videoURL, quizQuestions, timeRequired, xpReward} = req.body;
    try{
        const newContent = new Content ({
            title,
            type,
            xpReward,
            contentText: type === 'text' ? contentText : '', // Only for text
            videoURL: type === 'video' ? videoURL : '',
            quizQuestions: type === 'quiz' ? quizQuestions : [],
            timeRequired

        });

        await newContent.save();
        res.status(201).json({message: 'Content added successfully'});
    } catch(error){
        console.log(error);
        res.status(500).json({message: 'Something went wrong', error: error.message});
    }
};
const getContent = async (req, res) => {
    try {
        const contents = await Content.find();
        res.status(200).json(contents);
    }catch(error){
        res.status(500).json({ message: 'Error fetching content', error: error.message });
    }
};
const markContentOngoing = async(req, res) => {
    const userId = req.body.userId;
    const contentId = req.params.contentId;
    try {
        const user = await User.findById(userId);
        if (!user){
            return res.status(404).json({message: 'User not found'});
        }
        if (!user.ongoingContents.includes(contentId)){
            user.ongoingContents.push(contentId);
            await user.save();
        }
        res.status(200).json({message: 'Content added to ongoing list'});
    }catch(error){
        res.status(500).json({message: 'Something went wrong',  error: error.message});
    }
};

const markContentCompleted = async (req, res) => {
    const userId = req.body.userId;
    const contentId = req.params.contentId;
    try{
        const user = await User.findById(userId);
        if (!user){
            return res.status(404).json({message: 'User not found'});
        }
        user.ongoingContents = user.ongoingContents.filter(id => id != contentId);
        if (!user.completedContents.includes(contentId)){
            user.completedContents.push(contentId);
            await user.save();
        }
        res.status(200).json({message: 'Content marked as completed'});
    } catch(error){
        res.status(500).json({message: 'something went wrong',  error: error.message});
    }
};

const getOngoingCourses = async(req, res) => {
    const {userId} = req.params;
    console.log("User ID:", userId);
    try {
        const user = await User.findById(userId);
        console.log("User:", user);
        if (!user){
            return res.status(404).json({message: 'User not found'});

            
        }
        const ongoingContentsIds = user.ongoingContents;
        console.log("Ongoing Content IDs:", ongoingContentsIds);
        if (!ongoingContentsIds || ongoingContentsIds.length === 0){
                return res.status(404).json({message: 'No ongoing courses found for this user'});
        }
        const ongoingCourses = await Content.find({
            _id: {$in: ongoingContentsIds}
        });

        res.status(200).json(ongoingCourses);
        console.log("Fetched Ongoing Courses:", ongoingCourses);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Error fetching ongoing courses' });
    }
};

const getCompletedCourses = async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const completedContentIds = user.completedContents;
      if (!completedContentIds || completedContentIds.length === 0) {
        return res.status(404).json({ message: 'No completed courses found for this user' });
      }
  
      const completedCourses = await Content.find({
        _id: { $in: completedContentIds }
      });
  
      res.status(200).json(completedCourses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching completed courses' });
    }
  };

  const enrollInCourse = async (req, res) => {
    const { userId, courseId } = req.params;

    try {
        const user = await User.findById(userId);
        const course = await Content.findById(courseId);

        if (!user || !course) {
            return res.status(404).json({ message: 'User or Course not found' });
        }

        // Avoid duplicate enrollments
        if (!user.enrolledCourses.includes(courseId)) {
            user.enrolledCourses.push(courseId);
        }

        if (!user.ongoingContents.includes(courseId)) {
            user.ongoingContents.push(courseId);
        }

        await user.save();
        res.status(200).json({ message: 'Enrolled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Enrollment failed' });
    }
};

const completeCourse = async (req, res) => {
    const { userId, courseId } = req.params;

    try {
        const user = await User.findById(userId);
        const course = await Content.findById(courseId);

        if (!user || !course) {
            return res.status(404).json({ message: 'User or Course not found' });
        }

        // Remove from ongoing
        user.ongoingContents = user.ongoingContents.filter(id => id.toString() !== courseId);

        // Add to completed
        if (!user.completedContents.includes(courseId)) {
            user.completedContents.push(courseId);
        }

        // Update XP
        user.xp += course.xpReward || 0;

        await user.save();
        res.status(200).json({ message: 'Course completed and XP updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error completing course' });
    }
};

const getUserProfile = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId)
            .populate('enrolledCourses')
            .populate('ongoingContents')
            .populate('completedContents');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            username: user.username,
            email: user.email,
            xp: user.xp,
            badges: user.badges,
            enrolledCourses: user.enrolledCourses,
            ongoingContents: user.ongoingContents,
            completedCourses: user.completedCourses
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
};

const getContentById = async (req, res) => {
    try {
        const content = await Content.findById(req.params.id);
        if (!content) return res.status(404).json({ message: 'Content not found' });
        res.json(content);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};



  

module.exports = {
    addContent,
    getContent,
    markContentOngoing,
    markContentCompleted,
    getOngoingCourses,
    getCompletedCourses,
    enrollInCourse,
    completeCourse,
    getUserProfile,
    getContentById
};