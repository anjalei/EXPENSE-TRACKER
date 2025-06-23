const Expense = require('../model/expense');
const User = require('../model/user');
const sequelize = require('../util/database');


const getExpense = async (req, res) => {
    try {
        const userId = req.user.id;
        const isPremium = req.user.isPremium;

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const totalCount = await Expense.count({ where: { userId } });


        const expenses = await Expense.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            limit,
            offset,
        });

        const user = await User.findByPk(userId);
        const totalExpense = parseFloat(user.totalExpense) || 0;

        return res.json({
            isPremium,
            expenses,
            totalCount,
            totalExpense,
            currentPage: page,
            pageSize: limit,
        });
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};
const getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });
        if (!expense) return res.status(404).json({ error: 'Expense not found' });
        res.json(expense);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const postExpense = async (req, res) => {
        const t = await sequelize.transaction();
    try {
        const { expenseamount, description, category, note } = req.body;
         const userId = req.user.id;
        const newExpense = await Expense.create({
            expenseamount,
            description,
            category,
            userId: userId,
            note
               }, 
               { transaction: t
        });
         const user = await User.findByPk(userId, { transaction: t });
         const updatedTotal = parseFloat(user.totalExpense) + parseFloat(expenseamount);
        await user.update({ totalExpense: updatedTotal }, { transaction: t });
        await t.commit();
        res.status(201).json({ expense: newExpense, totalExpense: updatedTotal });

    } catch (error) {
        await t.rollback();
          console.error('Expense creation failed:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const updateExpenseById = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const expense = await Expense.findOne({
            where: { id: req.params.id, userId: req.user.id },
            transaction: t
        });
        if (!expense) {
            await t.rollback();
            return res.status(404).json({ error: 'Expense not found' });
        }

        const user = await User.findByPk(req.user.id, { transaction: t });

      
        const oldAmount = parseFloat(expense.expenseamount);
        const newAmount = parseFloat(req.body.expenseamount);
        const updatedTotal = parseFloat(user.totalExpense) - oldAmount + newAmount;

     
        await expense.update(req.body, { transaction: t });
        await user.update({ totalExpense: updatedTotal }, { transaction: t });

        await t.commit();
        res.json({ message: 'Expense updated successfully', totalExpense: updatedTotal });

    } catch (error) {
        await t.rollback();
        console.error('Update failed:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};


const deleteExpenseById = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const expense = await Expense.findOne({
            where: { id: req.params.id, userId: req.user.id },
            transaction: t
        });

        if (!expense) {
            await t.rollback();
            return res.status(404).json({ error: 'Expense not found' });
        }

        const user = await User.findByPk(req.user.id, { transaction: t });

        const deletedAmount = parseFloat(expense.expenseamount);
        const updatedTotal = parseFloat(user.totalExpense) - deletedAmount;

        await expense.destroy({ transaction: t });
        await user.update({ totalExpense: updatedTotal }, { transaction: t });

        await t.commit();
        res.json({ message: 'Expense deleted successfully', totalExpense: updatedTotal });

    } catch (error) {
        await t.rollback();
        console.error('Delete failed:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};



module.exports = {
    getExpense,
    getExpenseById,
    postExpense,
    updateExpenseById,
    deleteExpenseById
};
