export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  const { username, password } = req.body || {};

  const correctUsername = process.env.ADMIN_USERNAME;
  const correctPassword = process.env.ADMIN_PASSWORD;

  if (
    username !== correctUsername ||
    password !== correctPassword
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid username or password"
    });
  }

  const sessionCookie =
    "royalFurnitureProSession=authenticated; " +
    "HttpOnly; " +
    "Secure; " +
    "SameSite=Lax; " +
    "Path=/; " +
    "Max-Age=86400";

  res.setHeader("Set-Cookie", sessionCookie);

  return res.status(200).json({
    success: true
  });
}
