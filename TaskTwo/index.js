const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const { sequelize } = require('./models');

const app = express();
app.use(bodyParser.json());

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  sequelize.sync().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
} else {
  module.exports = app;
}