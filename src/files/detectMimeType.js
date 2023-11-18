function detectMimeType(pathname) {
  if (/.*\.jpg/.test(pathname)) {
    return 'image/jpeg';
  }
  if (/.*\.png/.test(pathname)) {
    return 'image/png';
  }
  if (/.*\.ico/.test(pathname)) {
    return 'image/x-icon';
  }
  if (/.*\.html/.test(pathname)) {
    return 'text/html';
  }
  if (/.*\.css/.test(pathname)) {
    return 'text/css';
  }
  if (/.*\.js/.test(pathname)) {
    return 'text/javascript';
  }
  if (/.*\.xsl/.test(pathname)) {
    return 'text/xml';
  }

  console.warn(`Cannot detect MIME type for ${pathname}`);
  return 'application/octet-stream';
}

module.exports = detectMimeType;
