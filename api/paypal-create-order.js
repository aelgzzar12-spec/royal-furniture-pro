export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({
        error: "PayPal credentials are not configured."
      });
    }

    const auth = Buffer.from(
      `${clientId}:${clientSecret}`
    ).toString("base64");

    // =========================
    // PayPal Authentication
    // =========================

    const tokenResponse = await fetch(
      "https://api-m.paypal.com/v1/oauth2/token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_credentials"
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error(
        "PayPal authentication error:",
        tokenData
      );

      return res.status(500).json({
        error: "Failed to authenticate with PayPal.",
        paypal: tokenData
      });
    }

    // =========================
    // Get Amount
    // =========================

    const { amount } = req.body || {};

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        error: "Invalid amount.",
        receivedAmount: amount
      });
    }

    // =========================
    // Create PayPal Order
    // =========================

    const orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: numericAmount.toFixed(2)
          }
        }
      ]
    };

    console.log(
      "Creating PayPal order:",
      JSON.stringify(orderPayload)
    );

    const orderResponse = await fetch(
      "https://api-m.paypal.com/v2/checkout/orders",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderPayload)
      }
    );

    const orderData = await orderResponse.json();

    // =========================
    // PayPal Order Error
    // =========================

    if (!orderResponse.ok) {
      console.error(
        "PayPal order creation failed:",
        JSON.stringify(orderData, null, 2)
      );

      return res.status(orderResponse.status).json({
        error: "Failed to create PayPal order.",

        paypal: {
          name: orderData?.name || null,
          message: orderData?.message || null,
          debug_id: orderData?.debug_id || null,
          details: orderData?.details || [],
          links: orderData?.links || []
        }
      });
    }

    // =========================
    // Success
    // =========================

    console.log(
      "PayPal order created successfully:",
      orderData.id
    );

    return res.status(200).json({
      id: orderData.id
    });

  } catch (error) {

    console.error(
      "PayPal server error:",
      error
    );

    return res.status(500).json({
      error: "Server error.",
      details: error.message
    });
  }
}
