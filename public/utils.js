function validateServer(value) {
  return /^http(s)?:\/\//.test(value);
}

function sanitizeParam(value) {
  return (value.split('&')[0] || '').replace(/offline_access/g, '');
}

function isValidParam(param) {
  return 'client_id scope response_type redirect_uri'.indexOf(param.split('=')[0] || '') !== -1;
}

function filterParams(params) {
  return '?' + params.replace(/\?/g, '')
    .split('&')
    .filter(param => isValidParam(param))
    .join('&');
}

module.exports = {
  sanitizeParam,
  validateServer,
  filterParams
};
