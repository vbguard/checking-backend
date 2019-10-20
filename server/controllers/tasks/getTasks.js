const Tasks = require('../../models/task.model');

const getTask = (req, res, next) => {
  console.log(req.user);

  Tasks.find({})
    .then(tasks => {
      res.status(200).json({
        status: 'success',
        tasks: tasks
      });
    })
    .catch(err =>
      res.json({
        status: 'error',
        error: err.mesage
      })
    );
};

module.exports = getTask;
