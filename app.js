const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const sequelize = require('./util/database');


const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const paymentRoutes = require('./routes/payment');
const leaderboardRoutes = require('./routes/leaderboard');
const passwordRoutes=require('./routes/password');


const User = require('./model/user');
const Expense = require('./model/expense');
const Premium = require('./model/Premium');
const ForgotPasswordRequest = require('./model/forgotPasswordRequest');


User.hasMany(Expense);
Expense.belongsTo(User);

User.hasOne(Premium);
Premium.belongsTo(User);

User.hasMany(ForgotPasswordRequest, { foreignKey: 'userId' });
ForgotPasswordRequest.belongsTo(User, { foreignKey: 'userId' });


app.use(cors());
app.use(express.static('public'));




app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', userRoutes);
app.use('/api', expenseRoutes);
app.use('/payment', paymentRoutes);
app.use('/api/premium', leaderboardRoutes);
app.use('/api/password', passwordRoutes);

console.log("✅ APP_ID:", process.env.APP_ID);
console.log("✅ SECRET_KEY:", process.env.SECRET_KEY);


const port = 3000;
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server running on ${port}, sequelize connected`);
  });
});