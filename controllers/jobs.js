const { StatusCodes } = require("http-status-codes");
const Job = require("../models/Job");
const { BadRequestError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user._id }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};
const getJob = async (req, res) => {
  const {
    user: { _id: userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOne({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new BadRequestError("Job not found!");
  }

  res.status(StatusCodes.OK).json({ job });
};
const createJob = async (req, res) => {
  req.body.createdBy = req.user._id;
  const job = await Job.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ job });
};
const updateJob = async (req, res) => {
  const {
    user: { _id: userId },
    params: { id: jobId },
    body: { company, status },
  } = req;

  if (!company || !status) {
    throw new BadRequestError("Company or Status value can not be empty");
  }

  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    { company, status },
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new BadRequestError("Job not found!");
  }
  res.status(StatusCodes.OK).json({ job });
};
const delelteJob = async (req, res) => {
  const {
    user: { _id: userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findByIdAndDelete({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new BadRequestError("Job not found!");
  }
  res.status(StatusCodes.OK).send("Deleted Successfully!");
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  delelteJob,
};
