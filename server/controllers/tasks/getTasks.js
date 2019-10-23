const ObjectId = require('mongoose').Types.ObjectId;
const Tasks = require('../../models/task.model');

const getTasks = (req, res) => {
  const userId = req.user.id;

  Tasks.aggregate([{ $match: { userId: ObjectId(userId) } }])
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

module.exports = getTasks;
