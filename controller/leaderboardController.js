
const User = require("../model/user");
const Expense = require("../model/expense");
const sequelize = require('../util/database');

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.findAll({
      attributes: [
        'id',
        'username',
        [sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('expenses.expenseamount')), 0), 'totalSpent']
      ],
      include: [
        {
          model: Expense,
          attributes: [],
          required: false  
        }
      ],
      group: ['User.id'],
      order: [[sequelize.literal('totalSpent'), 'DESC']]
    });

    const formattedData = leaderboard.map(entry => ({
      username: entry.username,
      totalSpent: parseFloat(entry.getDataValue('totalSpent')) || 0
    }));

    res.status(200).json(formattedData);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
