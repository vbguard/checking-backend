const Tasks = require('../../models/task.model');

const deleteTask = (req, res) => {
  const taskId = req.params.taskId;

  Tasks.findByIdAndDelete(taskId)
    .then(
      res.json({
        status: 'success',
        message: `Task with id : ${taskId} was deleted !`
      })
    )
    .catch(err =>
      res.status(400).json({
        status: 'failed',
        message: err.message
      })
    );
};

module.exports = deleteTask;
