// Defines "Fetch leaning content" API Logic
const Content = require('../models/Content');
const User = require('../models/User');

const addContent = async(req, res) =>{
    const {title, type, contentText, timeRequired} = req.body;
    try{
        const newContent = new Content ({
            title,
            type,
            contentText,
            timeRequired

        });

        await newContent.save();
        res.status(201).json({message: 'Content added successfully'});
    } catch(error){
        console.log(error);
        res.status(500).json({message: 'Something went wrong', error: error.message});
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

module.exports = {
    addContent,
    markContentOngoing,
    markContentCompleted
};