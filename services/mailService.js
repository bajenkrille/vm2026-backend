import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

async function sendCustomMail({ to, subject, text, html }) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    text,
    html
  });
}

async function sendWelcomeMail( to, username ) {
  console.log("Send mail to", to, username);
  try {
    await transporter.verify();
    console.log("SMTP OK");
  } catch (err) {
    console.error(err);
  }
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: "Välkommen till The One and Only VM-tips 2026",
    text: "Hej! Bra val av tips! Kul att du är med. Bara att sätta igång och tippa...",
    html: `
    <h1>Välkommen till The One and Only VM-tips 2026</h1>

    <p>
      Hej <strong>${username}</strong>!
    </p>

    <p>
      Tack för att du registrerade dig.
    </p>

    <p>
      Du kan nu logga in och börja tippa.
    </p>

    <p>
      <a href="https://omyndigheten.se/login">
        Logga in
      </a>
    </p>
  `
  });
}

async function sendPswResetMail({ to, subject, text, html }) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    text,
    html
  });
}

export {
  sendCustomMail,
  sendWelcomeMail,
  sendPswResetMail
};