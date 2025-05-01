const User = require('../models/User');
const badgeCalculator = require('../utils/badgeCalculator');

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('username email xp badges');;
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({
            username: user.username,
            email: user.email,
            xp: user.xp,
            badges: user.badges || [],
            
        });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

const updateXP = async (req, res) => {
    const { xpEarned } = req.body;

    try {
        const user = await User.findById(req.userId);
        user.xp += xpEarned;
        const badges = badgeCalculator(user.xp);
        console.log('XP:', user.xp, 'Badges:', badges);
        user.badges = badges;
        await user.save();
        res.status(200).json({ message: 'XP updated', xp: user.xp, badges: user.badges });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = {
    getProfile,
    updateXP
    
};
