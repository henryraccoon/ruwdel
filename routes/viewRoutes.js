const express = require('express');
const viewController = require('./../controllers/viewController');

const router = express.Router();

router.get('/', viewController.getOverview);

router.get('/search', viewController.getSearch);

module.exports = router;
