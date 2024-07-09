const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const { sequelize } = require('./models');
const config = require("config");

const app = express();
app.use(bodyParser.json());

app.use('/auth', authRoutes);

// Serve a welcome HTML page at the root route
app.get('/', (req, res) => {
  const welcomeHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          margin-top: 50px;
        }
        h1 {
          color: #333;
        }
        p {
          color: #666;
        }
      </style>
    </head>
    <body>
      <h1>Welcome to My Backend Service</h1>
      <p>This is the root route of the application.</p>
    </body>
    </html>
  `;
  res.send(welcomeHtml);
});

const PORT = process.env.PORT || config.get("PORT")|| 3000;

if (require.main === module) {
  sequelize.sync().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
} else {
  module.exports = app;
}
