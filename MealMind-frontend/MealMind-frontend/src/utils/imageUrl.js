const API_ORIGIN =
  "http://localhost:1403";

export const getImageUrl = (url) => {

  if (!url) {
    return "";
  }

  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:")
  ) {
    return url;
  }

  return `${API_ORIGIN}${url}`;

};
