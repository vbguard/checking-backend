const router = require('express').Router();

const getTasks = require('../controllers/tasks/getTasks');
const getTask = require('../controllers/tasks/getTask');
const createTask = require('../controllers/tasks/createTask');
const updateTask = require('../controllers/tasks/updateTask');
const deleteTask = require('../controllers/tasks/deleteTask');

router
  .get('/', getTasks)
  .get('/:taskId', getTask)
  .post('/', createTask)
  .put('/:taskId', updateTask)
  .delete('/:taskId', deleteTask);

module.exports = router;
