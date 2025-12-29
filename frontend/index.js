require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

/* --------------------------------------------------------------
   EMAIL TRANSPORTER
-------------------------------------------------------------- */
const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendEmail({ to, subject, html }) {
  return mailer.sendMail({
    from: `"NWT Filtration" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
}

/* ------------------------------------------------------------------
   CREATE ORDER (COD)
------------------------------------------------------------------ */
app.post("/api/orders", (req, res) => {
  console.log("REQUEST BODY ===>");
  console.log(req.body);

  const { customer, cart, summary } = req.body;

  // 1) insert customer
  const customerSql =
    "INSERT INTO customers (name, company, phone, address) VALUES (?,?,?,?)";

  db.query(
    customerSql,
    [customer.name, customer.company, customer.phone, customer.address],
    (err, customerResult) => {
      if (err) return res.status(500).json(err);

      const customerId = customerResult.insertId;

      // 2) create order
      const orderSql = `
        INSERT INTO orders 
        (customer_id, subtotal, gst, shipping, total, payment_status, order_status, payment_method)
        VALUES (?,?,?,?,?,'PENDING','CREATED','COD')
      `;

      db.query(
        orderSql,
        [
          customerId,
          summary.subtotal,
          summary.gst,
          summary.shipping,
          summary.total,
        ],
        (err, orderResult) => {
          if (err) return res.status(500).json(err);

          const orderId = orderResult.insertId;

          // 3) insert order items
          const itemsSql = `
            INSERT INTO order_items
            (order_id, product_id, product_name, quantity, unit_price, total_price)
            VALUES ?
          `;

          const values = cart.map(item => [
            orderId,
            item.id,
            item.name,
            item.qty,
            item.price,
            item.qty * item.price,
          ]);

          db.query(itemsSql, [values], async err => {
            if (err) return res.status(500).json(err);

            /* --------------------------------------------------
               EMAILS
            -------------------------------------------------- */
            try {
              // ADMIN EMAIL
              await sendEmail({
                to: "nwtfiltration@gmail.com",
                subject: `New Order Received - NWT #${orderId}`,
                html: `
                  <h2>New Order Received</h2>
                  <p><b>Order ID:</b> #${orderId}</p>
                  <p><b>Name:</b> ${customer.name}</p>
                  <p><b>Phone:</b> ${customer.phone}</p>
                  <p><b>Total:</b> ₹${summary.total}</p>
                  <hr />
                  <p>Login to dashboard to view complete order.</p>
                `,
              });

              // CUSTOMER EMAIL (only if email present)
              if (customer.email) {
                await sendEmail({
                  to: customer.email,
                  subject: "Your Order Has Been Placed - NWT Filtration",
                  html: `
                    <h2>Thank you for your order!</h2>
                    <p>Your order ID is <b>#${orderId}</b></p>
                    <p>We will contact you shortly.</p>
                    <br/>
                    <p>— NWT Filtration Team</p>
                  `,
                });
              }
            } catch (emailErr) {
              console.error("EMAIL ERROR:", emailErr);
            }

            res.json({ orderId });
          });
        }
      );
    }
  );
});

/* ------------------------------------------------------------------
   GET ORDER (Success Page)
------------------------------------------------------------------ */
app.get("/api/orders/:id", (req, res) => {
  const orderId = req.params.id;

  const sql = `
    SELECT o.*, c.name, c.company, c.phone, c.address
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    WHERE o.id = ?
  `;

  db.query(sql, [orderId], (err, order) => {
    if (err) return res.status(500).json(err);

    db.query(
      "SELECT * FROM order_items WHERE order_id = ?",
      [orderId],
      (err, items) => {
        if (err) return res.status(500).json(err);

        res.json({ order: order[0], items });
      }
    );
  });
});

/* ------------------------------------------------------------------
   DEALERS — TEMP CREATE
------------------------------------------------------------------ */
app.post("/api/dealers/create", async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO dealers (name, email, password) VALUES (?,?,?)";

  db.query(sql, [name, email, hashed], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Dealer created" });
  });
});

/* ------------------------------------------------------------------
   DEALER LOGIN
------------------------------------------------------------------ */
app.post("/api/dealers/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM dealers WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json(err);
    if (!results.length)
      return res.status(400).json({ message: "Dealer not found" });

    const dealer = results[0];

    const match = await bcrypt.compare(password, dealer.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { dealerId: dealer.id, email: dealer.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      dealer: {
        id: dealer.id,
        name: dealer.name,
        email: dealer.email,
      },
    });
  });
});

app.get("/api/orders", (req, res) => {
  const sql = `
    SELECT 
      o.id,
      o.total,
      o.payment_status,
      o.order_status,
      o.created_at,
      c.name AS customer_name,
      c.phone
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    ORDER BY o.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
});

app.put("/api/orders/:id/status", (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;

  let sql =
    "UPDATE orders SET order_status = ? WHERE id = ?";

  if (status === "DELIVERED") {
    sql =
      "UPDATE orders SET order_status = ?, payment_status = 'PAID' WHERE id = ?";
  }

  db.query(sql, [status, orderId], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Order updated" });
  });
});

/* ------------------------------------------------------------------
   AUTH MIDDLEWARE
------------------------------------------------------------------ */
function authDealer(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "No token" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.dealer = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

app.get("/api/dealers/me", authDealer, (req, res) => {
  res.json(req.dealer);
});

/* ------------------------------------------------------------------ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
