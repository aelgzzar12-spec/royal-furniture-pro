export default function handler(req, res) {
  const cookies = req.headers.cookie || "";

  const isAuthenticated = cookies
    .split(";")
    .some(cookie =>
      cookie.trim() === "royalFurnitureProSession=authenticated"
    );

  if (!isAuthenticated) {
    return res.status(401).json({
      authenticated: false
    });
  }

  return res.status(200).json({
    authenticated: true
  });
}
