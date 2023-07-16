const handleExpireTime = (isActive, expireTime) => {
    if (isActive) {
        if (expireTime.days !== 0) {
            return `Expires in ${expireTime.days} days`;
        } else {
            return `Expires in ${expireTime.hours} hours, ${expireTime.minutes} minutes`;
        }
    } else {
        if (expireTime.days !== 0) {
            return `Expired ${expireTime.days} days ago`;
        } else {
            return `Expired ${expireTime.hours} hours, ${expireTime.minutes} minutes ago`;
        }
    }
};

export default handleExpireTime