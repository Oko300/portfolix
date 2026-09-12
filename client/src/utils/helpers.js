export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const getFileTypeIcon = (fileType) => {
  if (!fileType) return '📄';
  if (fileType.startsWith('image')) return '🖼️';
  if (fileType.startsWith('video')) return '🎥';
  if (fileType === 'application/pdf') return '📄';
  if (fileType.includes('word') || fileType.includes('document')) return '📝';
  if (fileType.includes('code') || fileType.includes('javascript') || fileType.includes('python')) return '💻';
  return '📁';
};