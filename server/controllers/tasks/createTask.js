const mongoose = require('mongoose');
const Tasks = require('../../models/task.model');

const createTask = (req, res, next) => {
  const task = new Tasks({
    _id: mongoose.Types.ObjectId(),
    ...req.body,
    created: Date.now()
  });

  task
    .save()
    .then(task => {
      res.status(200).json({ status: 'success', task: task });
    })
    .catch(err => {
      res.json({
        status: 'error',
        message: err.message
      });
    });
};

module.exports = createTask;
