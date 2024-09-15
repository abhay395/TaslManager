const Task = require("../models/tasks");
const getAllTasks =async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const createTask = async(req, res) => {
  try {
    const { value, completed, priority } = req.body;
    const task = await Task.create({ value, completed, priority });
    console.log(task);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const getSingleTask = async(req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const updateTask = async(req, res) => {
  try {
    const { id } = req.params;
    const { value, completed, priority } = req.body;
    const task = await Task.findByIdAndUpdate(id, { value, completed, priority }, { new: true });
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const deleteTask = async(req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    res.status(200).json({ msg: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

module.exports = { getAllTasks, createTask, getSingleTask, updateTask, deleteTask };
