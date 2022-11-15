const express = require("express");

//controllers
const {
  getRequests,
  createRequest,
  getRequest,
  updateRequest,
  deleteRequest,
  getAllRequests,
} = require("../controllers/request");
const router = express.Router({ mergeParams: true });

// // Includes other resource routers
// const  kanban = require('./kanban')
// // Re-Routes into other resource routers
// router.use('/:kanbanId/requests', kanban)

router.route("/").get(getRequests).post(createRequest);
router.route("/:id").get(getRequest).put(updateRequest).delete(deleteRequest);

module.exports = router;
