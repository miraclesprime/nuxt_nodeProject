export function snipFileName(filename) {
  const dotIdx = filename.lastIndexOf('.');
  const name = dotIdx === -1 ? filename : filename.substring(0, dotIdx);
  const ext = dotIdx === -1 ? '' : filename.substr(dotIdx + 1);

  return name.substring(0, 10) + (name.length > 10 ? '...' : '.') + ext;
}

export function formatBytes(bytes) {
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const unitPos = Math.floor(Math.log2(bytes) / 10);
  const value = bytes / Math.pow(1024, unitPos);

  return `${unitPos === 0 ? value : value.toFixed(1)} ${units[unitPos]}`;
}

export function downloadFile(file) {
  const anchor = document.createElement('a');
  anchor.target = '_blank';
  anchor.href = file.url;
  anchor.download = file.name;
  anchor.click();
}