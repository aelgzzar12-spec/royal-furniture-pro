export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const clientId = process.env.PAYPAL_CLIENT_ID;

  if (!clientId) {
    return res.status(500).json({
      error: "PayPal Client ID is not configured."
    });
  }

  return res.status(200).json({
    clientId
  });
}
