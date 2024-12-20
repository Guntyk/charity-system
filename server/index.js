const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/organizations', require('./routes/organizations'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/volunteers', require('./routes/volunteers'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));

sequelize.sync({ alter: false }).then(() => {
  console.log('Database synced');
  app.listen(process.env.PORT || 8080, () => {
    console.log(`Server running on port ${process.env.PORT || 8080}`);
  });
});
