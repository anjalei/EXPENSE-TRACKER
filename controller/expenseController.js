const Expense = require('../model/expense');

const getExpense = async (req, res) => {
    try {
        const expenses = await Expense.findAll({
            where: { userId: req.user.id }
        });
        res.json(expenses);
    } catch (error) {
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
    try {
        const { expenseamount, description, category } = req.body;
        const newExpense = await Expense.create({
            expenseamount,
            description,
            category,
            userId: req.user.id
        });
        res.status(201).json(newExpense);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const updateExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });
        if (!expense) return res.status(404).json({ error: 'Expense not found' });
        await expense.update(req.body);
        res.json({ message: 'Expense Updated Successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

const deleteExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });
        if (!expense) return res.status(404).json({ error: 'Expense not found' });
        await expense.destroy();
        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
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
