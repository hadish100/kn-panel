const handleUserStatus = ({ dataUsage, totalData, isActive }) => {
    if (dataUsage >= totalData) {
        return "limited";
    } else if (isActive) {
        return "active";
    } else {
        return "expired";
    }
};

export default handleUserStatus;