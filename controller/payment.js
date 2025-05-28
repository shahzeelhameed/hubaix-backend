const util = require("util");
const db = require("../db/index"); // Assuming dbConfig is correctly configured for MySQL
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_KEY);

function generateRandomId(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const makePayment = async (req, res) => {
  const randomId = generateRandomId(50);
  const priceValue = req.body.price;
  try {
    if (!priceValue || priceValue < 150) {
      return res.status(400).json({ message: "Min price value is 150Rs." });
    }
    const jsDate = new Date();
    const paymentInitiatedTime = jsDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const price = await stripe.prices.create({
      unit_amount: priceValue * 100, // Stripe expects the price in the smallest currency unit (e.g., cents)
      currency: "pkr",
      product: process.env.STRIPE_PRODUCT_ID,
    });

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      metadata: {
        paymentInitiatedTime: paymentInitiatedTime,
        paymentLinkIdDb: randomId,
      },
      after_completion: {
        type: "redirect",
        redirect: {
          url: `${process.env.FRONTEND_URL}/payment/success?id=${randomId}`,
        },
      },
    });

    console.log("paymentLink: ", paymentLink);

    const query = `
            INSERT INTO payments(payment_link_id, payment_initiated_time, type, unique_id, amount) 
            VALUES(?, ?, ?, ?, ?)
        `;
    const values = [
      paymentLink.id,
      paymentInitiatedTime,
      "donation",
      randomId,
      priceValue,
    ];

    await db.query(query, values);

    res.status(200).json({ link: paymentLink.url, id: paymentLink.id });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const savePayment = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).json({ message: "Payment ID is required." });
    }

    const queryS = `SELECT * FROM payments WHERE unique_id = ?`;
    const [result] = await db.query(queryS, [req.body.id]);

    if (result.length === 0) {
      return res.status(404).json({ message: "The payment is not found!" });
    }

    const jsDate = new Date();
    const paymentCompletedTime = jsDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const query = `
            UPDATE payments 
            SET payment_completed = true, payment_completed_time = ? 
            WHERE unique_id = ?
        `;
    const values = [paymentCompletedTime, req.body.id];

    await db.query(query, values);

    res.json({ message: "Payment has been saved successfully!" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getPayments = async (req, res) => {
  try {
    const queryS = `SELECT * FROM payments WHERE payment_completed = true`;
    const [result] = await db.query(queryS);

    if (result.length === 0) {
      return res.status(404).json({ message: "No completed payments found!" });
    }

    res.json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = {
  makePayment,
  savePayment,
  getPayments,
};
