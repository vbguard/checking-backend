const Tasks = require('../../models/task.model');

const updateTask = (req, res, next) => {
  const id = req.body._id;

  Tasks.findOneAndUpdate({ _id: id }, { $set: req.body }, { new: true })
    .then(updatedData =>
      res.status(200).json({ status: 'success', task: updatedData })
    )
    .catch(err => {
      res.json({ status: 'error', message: err.message });
    });
};

module.exports = updateTask;
