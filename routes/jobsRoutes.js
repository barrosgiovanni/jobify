const express = require('express');
const router = express.Router();
const testUser = require('../middleware/test-user');

const {
  getAllJobs,
  createJob,
  showStats,
  updateJob,
  deleteJob
} = require('../controllers/jobsController');

router.route('/').get(getAllJobs);
router.route('/').post(testUser, createJob);
router.route('/stats').get(showStats);
router.route('/:id').patch(testUser, updateJob);
router.route('/:id').delete(testUser, deleteJob);

module.exports = router;
