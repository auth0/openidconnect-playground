import url from 'url';

function validateServer(value) {
  return /^http(s)?:\/\//.test(value);
}

function sanitizeParam(value) {
  return (value.split('&')[0] || '').replace(/offline_access/g, '');
}

function sanitizeEndpoint(value) {
  return value.split('?')[0] || '';
}

function isValidScope(scope, server, audience) {
  return server === 'Auth0' && audience ?
    true :
    'openid profile email phone address'.indexOf(scope) !== -1;
}

function filterScopes(scopes, server, audience) {
  return scopes.split(' ')
    .filter(scope => isValidScope(scope, server, audience))
    .join(' ');
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

function validateUrl(value) {
  const parsed = url.parse(value);

  return parsed.protocol === 'http:' || parsed.protocol === 'https:';
}

module.exports = {
  filterParams,
  filterScopes,
  sanitizeEndpoint,
  sanitizeParam,
  validateServer,
  validateUrl
};
