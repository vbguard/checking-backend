const Tasks = require('../../models/task.model');

const getTask = (req, res) => {
  const userId = req.user.id;
  const taskId = req.param.taskId;

  Tasks.find({ userId, taskId })
    .then(tasks => {
      res.status(200).json({
        status: 'success',
        tasks: tasks
      });
    })
    .catch(err =>
      res.status(400).json({
        status: 'error',
        error: err.message
      })
    );
};

module.exports = getTask;
