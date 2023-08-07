/*export default function (req, res, next) {
  if (req.url !== '/' && req.url.endsWith('/')) {
    const nextPath = req.url.replace(/\/+$/, '') || '/';
    res.writeHead(301, { Location: nextPath });
    res.end();
  } else {
    next();
  }
}*/

export default function ({ route, redirect }) {
  if (route.path !== '/' && route.path.endsWith('/')) {
    const { path, query, hash } = route;
    const nextPath = path.replace(/\/+$/, '') || '/';
    const nextRoute = { path: nextPath, query, hash };

    // return navigateTo(nextRoute, { redirectCode: 301 });
    redirect(nextPath)
  }
}