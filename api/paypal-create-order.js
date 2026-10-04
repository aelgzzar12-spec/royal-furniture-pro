export default function handler(req, res) {
  res.status(410).json({
    error: "PayPal payment is no longer available."
  });
}
