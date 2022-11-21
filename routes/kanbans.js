const express = require("express");
// get controller function
const { getKanbans, createKanban, getKanban, updateKanban, deleteKanban } = require("../controllers/kanbans");

const router = express.Router({mergeParams: true});


router.route('/').get(getKanbans).post(createKanban)
router.route('/:id').get(getKanban).put(updateKanban).delete(deleteKanban)



module.exports = router;
