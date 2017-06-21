export default function getFileIconByExtension(extension) {
  let icon;
  switch (extension) {
    case '.jpg':
    case '.png':
    case '.jpeg':
    case '.tiff':
    case '.gif':
    case '.svg':
      icon = 'fa fa-file-image-o';
      break;
    case '.pdf':
      icon = 'fa fa-file-pdf-o';
      break;
    case '.zip':
    case '.gz':
    case '.tar':
      icon = 'fa fa-file-archive-o';
      break;
    case '.mp3':
    case '.flac':
    case '.wav':
      icon = 'fa fa-file-audio-o';
      break;
    case '.mp4':
    case '.avi':
    case '.mpeg':
    case '.mov':
      icon = 'fa fa-file-video-o';
      break;
    case '.odt':
    case '.doc':
    case '.docx':
      icon = 'fa fa-file-word-o';
      break;
    case '.ods':
    case '.xls':
    case '.xlsx':
      icon = 'fa fa-file-excel-o';
      break;
    default:
      icon = 'fa fa-file-o';
      break;
  }
  return icon;
}
