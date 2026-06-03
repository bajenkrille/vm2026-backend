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

async function sendCustomMail( to, subject, text, html ) {
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

async function sendPswResetMail( to, resetLink, username ) {
  console.log("Send mail to", to, username);
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: "Password reset för VM-tipset",
    text: "${resetLink}",
    html:  `
    <h3>Länk för reset av password:</h3>

    <p>
      Hej <strong>${username}</strong>!
    </p>

    <p>
      Klicka på länken för att komma till password reset. Länken är giltig i 1 timme.
    </p>

    <p>
      ${resetLink}.
    </p>
  `
  });
}

async function sendTipsConfirmationMail( to, username, antalTippadeMatcher, meddelande ) {
  console.log("Send mail to", to, username);
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: "Ditt tips mottaget för VM-tipset",
    text: "${resetLink}",
    html:  `
    <h3>Ditt inskickade tips har tagits emot och sparats.</h3>
    <p>
      Hej <strong>${username}</strong>!
    </p>
    <p>
      Ditt tips innehöll ${antalTippadeMatcher} av 72 matcher.
    </p>
    <p>
      ${meddelande}
    </p>
    <p>
      Insatsen är 100 kr och swishas till <b>0702244230</b>. Var noga med att <b>ange för vilken deltagare betalningen gäller</b>.
    </p>    
    <p>
      (Helt frivilligt, men uppskattat, är ett litet bidrag för omkostnader á 5-10 kr. Ev överskott går tillbaka till vinstpotten.)
    </p>    
    <p>
      Om du inte har swish, maila krille.home@gmail.com för alternativ betalningsmetod.
    </p>    
  `
  });
}

export {
  sendCustomMail,
  sendWelcomeMail,
  sendPswResetMail,
  sendTipsConfirmationMail
};