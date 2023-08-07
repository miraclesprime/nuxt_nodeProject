export default function (req, res, next) {
  if (req.url !== '/' && req.url.endsWith('/')) {
    const nextPath = req.url.replace(/\/+$/, '') || '/';
    res.writeHead(301, { Location: nextPath });
    res.end();
  } else {
    next();
  }
}