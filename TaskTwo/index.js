const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const authRoutes = require('./routes/authRoutes');
const organisationRoutes = require('./routes/organisationRoutes');

const prisma = new PrismaClient();
const app = express();

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/api/organisations', organisationRoutes);

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

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
