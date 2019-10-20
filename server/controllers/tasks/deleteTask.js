const mongoose = require('mongoose');
const Tasks = require('../../models/task.model');

const deleteTask = (req, res, next) => {
  const id = req.body._id;

  Tasks.findByIdAndDelete({ _id: id })
    .then(
      res.json({
        status: 'success',
        message: `Task with id : ${id} was deleted !`
      })
    )
    .catch(err =>
      res.json({
        status: 'failed',
        message: err.message
      })
    );
};

module.exports = deleteTask;
