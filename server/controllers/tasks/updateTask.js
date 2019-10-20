const Tasks = require('../../models/task.model');

const updateTask = (req, res) => {
  const taskId = req.param.taskId;

  Tasks.findOneAndUpdate({ _id: taskId }, { $set: req.body }, { new: true })
    .then(updatedData =>
      res.status(200).json({ status: 'success', task: updatedData })
    )
    .catch(err => {
      res.status(400).json({ status: 'error', message: err.message });
    });
};

module.exports = updateTask;
