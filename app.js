const express = require('express');
const app = express();
const sequelize = require('./util/database');
const userRoutes = require('./routes/user');
const expenseRoutes=require('./routes/expense')
const User = require('./model/user');
const Expense=require('./model/expense')
const cors = require('cors');

app.use (cors());
app.use(express.static('public'));
app.use(express.json());
 app.use('/api',userRoutes);
 app.use('/api', expenseRoutes);

 User.hasMany(Expense);
Expense.belongsTo(User);

 const port = 3000;
 sequelize.sync().then(res=>{
    app.listen(port,()=>{
        console.log(`Server running on ${port},sequelize connected`)
    })
 })