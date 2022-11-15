const express = require("express");
const {
  getKanbans,
  createKanban,
  getKanban,
  updateKanban,
  deleteKanban,
} = require("../controllers/kanban");

// Includes other resource routers
const request = require("./request");

const router = express.Router();

// Re-Routes into other resource routers
router.use("/:kanbanId/requests", request);

router.route("/").get(getKanbans).post(createKanban);
router.route("/:id").get(getKanban).put(updateKanban).delete(deleteKanban);

module.exports = router;
