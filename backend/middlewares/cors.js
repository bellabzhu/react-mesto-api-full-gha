const allowedCors = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://mestobella.nomoredomains.work',
  'https://mestobella.nomoredomains.work',
];

module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req.method;

  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('credentials', true);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
};
