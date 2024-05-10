const express = require("express");
const {
  getAllJobs,
  createJob,
  getJob,
  delelteJob,
  updateJob,
} = require("../controllers/jobs");

const router = express.Router();

router.route("/").get(getAllJobs).post(createJob);
router.route("/:id").get(getJob).delete(delelteJob).patch(updateJob);

module.exports = router;
