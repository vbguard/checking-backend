const mongoose = require('mongoose');

const TasksShema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
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
});

module.exports = mongoose.model('Tasks', TasksShema);
