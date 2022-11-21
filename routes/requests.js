const express = require("express");
// get controller function
const { getRequests, getRequest, addRequest, updateRequest, deleteRequest } = require("../controllers/requests");

const router = express.Router({mergeParams: true});


router.route('/').get(getRequests).post(addRequest)
router.route('/:id').get(getRequest).put(updateRequest).delete(deleteRequest)


module.exports = router;
