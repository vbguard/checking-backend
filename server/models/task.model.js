const mongoose = require('mongoose');

const TasksSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      default: 'None',
      enum: ['Partner', 'Learner', 'Daughter/Son', 'Co-worker', 'None']
    },
    date: {
      type: Date
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    time: { type: String, default: 'All day' },
    priority: {
      type: Number,
      enum: [3, 1, 2],
      default: 3
    },
    isComplete: {
      type: Boolean,
      default: false
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users'
    }
  },
  {
    timestamps: true
  }
);

TasksSchema.pre('findOneAndUpdate', function() {
  const update = this.getUpdate();
  if (update.__v != null) delete update.__v;

  const keys = ['$set', '$setOnInsert'];
  for (const key of keys)
    if (update[key] != null && update[key].__v != null) {
      delete update[key].__v;
      if (Object.keys(update[key]).length === 0) delete update[key];
    }

  update.$inc = update.$inc || {};
  update.$inc.__v = 1;
});

const Tasks = mongoose.model('Tasks', TasksSchema);
module.exports = Tasks;
