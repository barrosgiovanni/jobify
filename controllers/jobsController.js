const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const checkUserPermission = require('../utils/checkUserPermission');
const mongoose = require('mongoose');
const moment = require('moment');

const getAllJobs = async (req, res) => {
  console.log(req.user);
  const { search, status, jobType, sort } = req.query;
  const queryObject = {
    createdBy: req.user.userId
  };

  if (status !== 'all') {
    queryObject.status = status
  }

  if (jobType !== 'all') {
    queryObject.jobType = jobType
  }

  if (search) {
    queryObject.position = { $regex: search, $options: 'i' }
  }

  let result = Job.find(queryObject);

  if (sort === 'oldest') {
    result = result.sort('createdAt')
  }

  if (sort === 'latest') {
    result = result.sort('-createdAt')
  }

  if (sort === 'a-z') {
    result = result.sort('position')
  }

  if (sort === 'z-a') {
    result = result.sort('-position')
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);
  const jobs = await result;
  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs/limit);
  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
};

const createJob = async (req, res) => {
  const { company, position } = req.body;

  if (!company || !position) {
    throw new BadRequestError('Please, provide all values.')
  }

  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) }},
    { $group: { _id: '$status', count: { $sum: 1 }}}
  ]);

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) }},
    { $group: {
      _id: {
        year: {
          $year: '$createdAt'
        },
        month: {
          $month: '$createdAt'
        }
      },
      count: { $sum: 1 }
    }},
    { $sort: { '_id.year': -1, '_id.month': -1 }},
    { $limit: 5 }
  ]);

  monthlyApplications = monthlyApplications.map((item) => {
    const { _id: { year, month }, count } = item;
    const date = moment().month(month-1).year(year).format('MMM Y')
    return { date, count }
  }).reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { position, company } = req.body;

  if (!position || !company) {
    throw new BadRequestError('Please, provide all values.');
  }

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`Could not locate job with id: ${jobId}`);
  }

  checkUserPermission(req.user, job.createdBy);

  const filter = { _id: jobId };
  const update = req.body;
  const options = { new: true, runValidators: true };

  const updatedJob = await Job.findOneAndUpdate(filter, update, options);

  res.status(StatusCodes.OK).json({ job: updatedJob });
};

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;
  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`Could not locate job with id: ${jobId}`);
  }

  checkUserPermission(req.user, job.createdBy);

  await Job.findOneAndDelete({ _id: jobId });
  res.status(StatusCodes.OK).json({ msg: 'Job was successfully deleted!' });
};

module.exports = {
  getAllJobs,
  createJob,
  showStats,
  updateJob,
  deleteJob
};
