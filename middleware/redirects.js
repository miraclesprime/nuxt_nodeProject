export default function ({ route, redirect }, next) {
  // Your redirect logic here
  if (route.path === '/') {
    return redirect('/mytasks')
  } else {
    next()
  }
}

/*export default function (req, res, next) {
  const redirects = [
    {
      from: "/",
      to: "/mytasks",
    },
  ];
  const redirect = redirects.find((r) => r.from === req.url);
  if (redirect) {
    res.writeHead(301, { Location: redirect.to });
    res.end();
  } else {
    next();
  }
}
*/