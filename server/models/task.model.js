const mongoose = require('mongoose');

const TasksSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ['Partner', 'Learner', 'Daughter/Son', 'Co-worker', 'None']
    },
    date: {
      type: String,
      default: Date
    },
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: String,
    time: {
      allDay: Boolean,
      from: Number,
      to: Number
    },
    priority: {
      type: Number,
      enum: [0, 1, 2],
      default: 0
    },
    isComplete: {
      type: Boolean,
      default: false
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

module.exports = mongoose.model('Tasks', TasksSchema);
