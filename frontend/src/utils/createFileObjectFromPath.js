const createFileObjectFromPath = async (path) => {
    path = import.meta.env.VITE_COURSE_SERVER_URL + path;
    const response = await fetch(path, { responseType: 'blob' }); // Set responseType to 'blob'
    const blob = await response.blob();

    const fileObj = new File([blob], response.url.split('/').pop(), { type: blob.type }); // Create File object
    fileObj.objectURL = URL.createObjectURL(blob); // Generate objectURL
    return [fileObj];
}

export default createFileObjectFromPath;