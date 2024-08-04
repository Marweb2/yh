export const removeHTTPPrefixController = (link) => {
  if (link?.trim().startsWith("https://")) {
    return link.slice(8);
  } else if (link?.trim().startsWith("http://")) {
    return link.slice(7);
  } else {
    return link;
  }
};
export const isValidLinkController = (link) => {
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlRegex.test(link);
};
