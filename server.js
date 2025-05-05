const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect('mongodb://mongo:27017/tododb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB Connection Error:", err));
const todoSchema = new mongoose.Schema({ task: { type: String, required: true },done: { type: Boolean, default: false }});
const Todo = mongoose.model('Todo', todoSchema);

// Routes
app.post('/todos', async (req, res) => {
    const { task } = req.body;
    if (!task) return res.status(400).json({ message: "Task is required" });
    const newTodo = new Todo({ task });
    await newTodo.save();
    res.status(201).json(newTodo);
});
app.get('/todos', async (req, res) => {
    const todos = await Todo.find();
    res.status(200).json(todos);
});
app.put('/todos/:id', async (req, res) => {
    const { done } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
        req.params.id,
        { done },
        { new: true }
    );
    if (!updatedTodo) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json(updatedTodo);
});
app.delete('/todos/:id', async (req, res) => {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) return res.status(404).json({ message: "Todo not found" });
    res.status(204).json({ message: "Todo deleted successfully" });
});

// Start server
app.listen(PORT, () => console.log(`ToDo Server running at http://localhost:${PORT}`));
