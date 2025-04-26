const express = require('express');
const app = express();
const sequelize = require('./util/database');
const expenseRoutes = require('./routes/expense');
const User = require('./model/user');
const cors = require('cors');

app.use (cors());
app.use(express.static('public'));
app.use(express.json());
 app.use('/api',expenseRoutes);

 const port = 3000;
 sequelize.sync().then(res=>{
    app.listen(port,()=>{
        console.log(`Server running on ${port},sequelize connected`)
    })
 })