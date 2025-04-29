const User = require('../models/User');
const badgeCalculator = require('../utils/badgeCalculator');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('completedContents ongoingContents');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({
            username: user.username,
            email: user.email,
            xp: user.xp,
            badges: user.badges,
            ongoingContents: user.ongoingContents,
            completedContents: user.completedContents
        });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

exports.updateXP = async (req, res) => {
    const { xpEarned } = req.body;
    try {
        const user = await User.findById(req.userId);
        user.xp += xpEarned;
        user.badges = badgeCalculator(user.xp);

        await user.save();
        res.status(200).json({ message: 'XP updated', xp: user.xp, badges: user.badges });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};
