const handleExpireTime = (expireTime) => {
    const current_time = parseInt(Date.now()/1000);
    const isActive = current_time < expireTime;
    const remaining_days = Math.abs(parseInt((current_time-expireTime)/(60*60*24)));
    const remaining_hours = remaining_days*24;
    const remaining_minutes = remaining_hours*60;
    if (isActive) {
        if (remaining_days !== 0) {
            return `Expires in ${remaining_days} days`;
        } else {
            return `Expires in ${remaining_hours} hours, ${remaining_minutes} minutes`;
        }
    } else {
        if (remaining_days !== 0) {
            return `Expired ${remaining_days} days ago`;
        } else {
            return `Expired ${remaining_hours} hours, ${remaining_minutes} minutes ago`;
        }
    }
};

export default handleExpireTime