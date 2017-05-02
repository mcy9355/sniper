var urls = {
  // dev: '/api/',
  dev: '',
  production: 'http://www.abc.com/'
};
var isDebug = true;
function baseURL(url) {
  if (isDebug) {
    return urls.dev + url;
  } else {
    return urls.production + url;
  }
}

module.exports = baseURL;