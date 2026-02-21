const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();

// const corsOptions = {
//   origin: 'http://localhost:3000', // Разрешите только этот источник
//   credentials: true, // Разрешите использование учетных данных
// };

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());


// tour reservation form
app.use(express.static(path.join(__dirname, "client", "build")));

// 3. Все остальные запросы отдаем React (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});


app.post("/send-email", (req, res) => {
  const { tourName, firstName, lastName, year, from, birthday, startDate, days, state, city, pincode, course, email } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "parmanitour@gmail.com",
      pass: "apllkepmhgkkiemo"
    }
  });

  const mailOptions = {
    from: "parmanitour@gmail.com",
    to: "parmanitour@gmail.com",
    subject: "New Student Registration",
    text: `
      Tour Name: ${tourName}
      First Name: ${firstName}
      Last Name: ${lastName}
      Year: ${year}
      From: ${from}
      Birthday: ${birthday}
      StartDate: ${startDate}
      Days: ${days}
      State: ${state}
      City: ${city}
      Pincode: ${pincode}
      Course: ${course}
      Email: ${email}
    `
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send("Email sent: " + info.response);
  });
});

// contact form

app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "parmanitour@gmail.com",
      pass: "apllkepmhgkkiemo"
    }
  });

  const mailOptions = {
    from: email, // email пользователя
    to: "parmanitour@gmail.com",
    subject: "New Contact Message",
    text: `
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send("Contact message sent: " + info.response);
  });
});

// user registration

// Маршрут регистрации
// app.post('/register', (req, res) => {
//   const { user, pwd } = req.body;

//   // Простая валидация (можете настроить больше правил по желанию)
//   if (!user || !pwd) {
//       return res.status(400).json({ message: 'Username and password are required.' });
//   }

//   // Можете здесь добавить логику для сохранения данных в базу данных
//   // Например, сохранение пользователя

//   res.status(201).json({ message: 'User registered successfully' });
// });


app.listen(3001, () => {
  console.log("Server started on port 3001");
});
