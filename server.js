require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Email sender function
const sendMail = async (formData) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS, // Your Gmail App Password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.recipient_email,
    subject: "New Form Submission",
    html: `
        <p><strong>Full Name:</strong> ${formData.full_name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>WhatsApp:</strong> ${formData.whatsapp_number}</p>
        <p><strong>Country:</strong> ${formData.country}</p>
        <p><strong>Instagram:</strong> ${formData.instagram_handle || "didn't provide"}</p>
        <p><strong>Trading Experience:</strong> ${formData.trading_experience}</p>
        <p><strong>Primary Market:</strong> ${formData.primary_market}</p>
        <p><strong>Trading Results:</strong> ${formData.trading_results}</p>
        <p><strong>Biggest Trading Struggle:</strong> ${formData.biggest_trading_struggle}</p>
        <p><strong>Current Broker:</strong> ${formData.current_broker}</p>
        <p><strong>Willing to Use Recommended Broker:</strong> ${formData.willing_to_use_recommended_broker}</p>
        <p><strong>Capital to Manage:</strong> ${formData.capital_to_manage}</p>
        <p><strong>Self-Discipline Score:</strong> ${formData.self_discipline_score}</p>
        <p><strong>Trade Journaling:</strong> ${formData.trade_journaling}</p>
        <p><strong>Blown Account Before:</strong> ${formData.blown_account}</p>
        <p><strong>Times Blown Account:</strong> ${formData.times_blown_account}</p>
        <p><strong>Largest Loss:</strong> ${formData.largest_loss}</p>
        <p><strong>90-Day Goal:</strong> ${formData.goal_for_challenge}</p>
        <p><strong>Daily Check-In Commitment:</strong> ${formData.daily_check_in_commitment}</p>
        <p><strong>Feedback on Trades:</strong> ${formData.trade_feedback_commitment}</p>
        <p><strong>Contacted via Email and WhatsApp:</strong> ${formData.check_in_commitment}</p>
    `,
};

  return await transporter.sendMail(mailOptions);
};

// Handle form submission
app.post("/submit-form", async (req, res) => {
  try {
    await sendMail(req.body);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
