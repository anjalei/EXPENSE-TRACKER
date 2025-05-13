const express = require('express');
const app = express();
require('dotenv').config();
const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const sequelize = require('./util/database');
const cors = require('cors');

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const paymentRoutes = require('./routes/payment');
const webhookRoutes = require('./routes/webhook');

const User = require('./model/user');
const Expense = require('./model/expense');
const Premium = require('./model/premium');


User.hasMany(Expense);
Expense.belongsTo(User);

User.hasOne(Premium);
Premium.belongsTo(User);


app.use(cors());
app.use(express.static('public'));


app.use('/webhook', express.raw({ type: 'application/json' }), webhookRoutes);

app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', expenseRoutes);
app.use('/api', paymentRoutes);


const port = 3000;
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server running on ${port}, sequelize connected`);
  });
});
