const convertData = (data) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = data;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return size.toFixed(2) + ' ' + units[unitIndex];
};

export default convertData