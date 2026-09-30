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
    username === correctUsername &&
    password === correctPassword
  ) {
    res.setHeader(
      "Set-Cookie",
      "royalFurnitureProSession=authenticated; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400"
    );

    return res.status(200).json({
      success: true
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid username or password"
  });
}
