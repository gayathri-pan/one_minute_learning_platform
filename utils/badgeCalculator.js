const badgeCalculator = (xp) => {
    const badges = [];
    if (xp >= 100) badges.push('Beginner');
    if (xp >= 500) badges.push('Intermediate');
    if (xp >= 1000) badges.push('Pro Learner');
    return badges;
};

module.exports = badgeCalculator;