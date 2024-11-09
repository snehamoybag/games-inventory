const isValidUrl = (url = "") => {
  return /^(http|https):\/\/[^\s$.?#].[^\s]*$/.test(url);
};

module.exports = isValidUrl;
