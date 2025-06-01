
const User = require("../model/user");
const Expense = require("../model/expense");
const sequelize = require('../util/database');

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Expense.findAll({
      attributes: [
        'userId',
        [sequelize.fn('SUM', sequelize.col('expenseamount')), 'totalSpent']
      ],
      include: [
        {
          model: User,
          attributes: ['username'],
          required: true // this ensures the join must return a User
        }
      ],
      group: ['userId'],
      order: [[sequelize.literal('totalSpent'), 'DESC']]
    });

    const formattedData = leaderboard.map(entry => ({
      username: entry.user?.username || "Unknown",
      totalSpent: entry.getDataValue('totalSpent')
    }));

    res.status(200).json({ leaderboard: formattedData });
  } catch (err) {
    console.error("🔴 Error fetching leaderboard:", err);
    res.status(500).json({ message: "Something went wrong in leaderboard" });
  }
};
