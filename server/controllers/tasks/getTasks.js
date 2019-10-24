const ObjectId = require('mongoose').Types.ObjectId;
const Tasks = require('../../models/task.model');
const moment = require('moment');

const getTasks = (req, res) => {
  const userId = req.user.id;
  const today = moment().dayOfYear();
  console.log('today', today);
  Tasks.aggregate([
    { $match: { userId: ObjectId(userId) } },
    // {
    //   $bucket: {
    //     groupBy: { $dayOfYear: '$date' },
    //     boundaries: [0, today],
    //     default: 'Unknow',
    //     output: {
    //       today: { $push: { title: '$title' } }
    //     }
    //   }
    // }
    {
      $project: {
        date: true,
        dayofYear: { $dayOfYear: '$date' },
        role: true,
        time: true,
        priority: true,
        isComplete: true,
        title: true,
        description: true
      }
    },
    // {
    //   $group: {
    //     _id: false,
    //     tasks: {
    //       $filter: {
    //         input: '$$ROOT',
    //         as: 'doc',
    //         cond: { $eq: ['$$doc.dayofYear', today] }
    //       }
    //     }
    //   }
    // }
    {
      $group: {
        _id: false,
        tasks: { $push: '$$ROOT' }
        // today:
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
                { $lte: ['$$doc.dayofYear', today] },
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

    // {
    //   $group: {
    //     _id: false,
    //     itemsSold: { $addToSet: { $eq: ['$_id', today] } },
    //     ttt: [{ $match: { $eq: ['$_id', today] } }],
    //     today: {
    //       $push: {
    //         $cond: {
    //           if: { $eq: ['$_id', today] },
    //           then: '$tasks',
    //           else: null
    //         }
    //       }
    //     },
    //     tomorrow: {
    //       $push: {
    //         $cond: {
    //           if: { $eq: ['$_id', today + 1] },
    //           then: '$tasks',
    //           else: null
    //         }
    //       }
    //     }
    //     // tomorrow: {
    //     //   $cond: [{ $eq: ['$_id', today + 1] }, '$tasks', null]
    //     // }
    //   }
    // }
  ])
    .then(tasks => {
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
