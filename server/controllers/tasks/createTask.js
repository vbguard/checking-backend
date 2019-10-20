const Tasks = require('../../models/task.model');

const createTask = (req, res) => {
  const userId = req.user.id;

  const task = new Tasks({
    ...req.body,
    userId
  });

  task
    .save()
    .then(task => {
      res.status(201).json({ status: 'success', task: task });
    })
    .catch(err => {
      res.status(400).json({
        status: 'error',
        message: err.message
      });
    });
};

module.exports = createTask;
