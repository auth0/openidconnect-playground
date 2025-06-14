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

export {
    filterParams,
    sanitizeEndpoint,
    sanitizeParam,
    validateServer,
    validateUrl
};