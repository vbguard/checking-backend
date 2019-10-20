const { Router } = require('express');

const getTasks = require('../controllers/tasks/getTasks');
const createTask = require('../controllers/tasks/createTask');
const updateTask = require('../controllers/tasks/updateTask');
const deleteTask = require('../controllers/tasks/deleteTask');

const router = Router();

router
  .get('/', getTasks)
  .get('/:id', getTasks)
  .post('/', createTask)
  .put('/:id', updateTask)
  .delete('/:id', deleteTask);

module.exports = router;
