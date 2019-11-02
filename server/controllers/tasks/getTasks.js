const ObjectId = require('mongoose').Types.ObjectId;
const Tasks = require('../../models/task.model');
const moment = require('moment');

const getTasks = (req, res) => {
  const userId = req.user.id;
  const today = moment().dayOfYear();

  Tasks.aggregate([
    { $match: { userId: ObjectId(userId) } },
    {
      $project: {
        date: {
          $dateToString: {
            date: '$date',
            timezone: 'Europe/Kyiv'
          }
        },
        dayofYear: {
          $dayOfYear: {
            date: '$date',
            timezone: 'Europe/Kyiv'
          }
        },
        role: true,
        time: true,
        priority: true,
        isComplete: true,
        title: true,
        description: true
      }
    },
    {
      $group: {
        _id: false,
        tasks: { $push: '$$ROOT' }
      }
    },
    {
      $project: {
        _id: false,
        today: {
          $filter: {
            input: '$tasks',
            as: 'doc',
            cond: {
              $and: [
                { $eq: ['$$doc.dayofYear', today] },
                { $eq: ['$$doc.isComplete', false] }
              ]
            }
          }
        },
        tomorrow: {
          $filter: {
            input: '$tasks',
            as: 'doc',
            cond: {
              $and: [
                { $eq: ['$$doc.dayofYear', today + 1] },
                { $eq: ['$$doc.isComplete', false] }
              ]
            }
          }
        },
        next: {
          $filter: {
            input: '$tasks',
            as: 'doc',
            cond: {
              $and: [
                { $gte: ['$$doc.dayofYear', today + 2] },
                { $lte: ['$$doc.dayofYear', today + 6] },
                { $eq: ['$$doc.isComplete', false] }
              ]
            }
          }
        },
        after: {
          $filter: {
            input: '$tasks',
            as: 'doc',
            cond: {
              $and: [
                { $gte: ['$$doc.dayofYear', today + 6] },
                { $eq: ['$$doc.isComplete', false] }
              ]
            }
          }
        },
        burnOut: {
          $filter: {
            input: '$tasks',
            as: 'doc',
            cond: {
              $and: [
                { $lt: ['$$doc.dayofYear', today] },
                { $eq: ['$$doc.isComplete', false] }
              ]
            }
          }
        },
        done: {
          $filter: {
            input: '$tasks',
            as: 'doc',
            cond: {
              $and: [{ $eq: ['$$doc.isComplete', true] }]
            }
          }
        }
      }
    }
  ])
    .then(tasks => {
      if (tasks.length === 0)
        return res.status(200).json({
          status: 'succes',
          tasks: {
            todayTomorrow: {
              today: [],
              tomorrow: []
            },
            nextAfter: {
              next: [],
              after: []
            },
            burnedOut: [],
            done: []
          }
        });

      res.status(200).json({
        status: 'success',
        tasks: {
          todayTomorrow: {
            today: tasks[0].today,
            tomorrow: tasks[0].tomorrow
          },
          nextAfter: {
            next: tasks[0].next,
            after: tasks[0].after
          },
          burnedOut: tasks[0].burnOut,
          done: tasks[0].done
        }
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
