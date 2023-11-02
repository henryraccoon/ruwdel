const express = require('express');
const systemController = require('./../controllers/systemController');
const router = express.Router();

router.get('/totals', systemController.getTotals);
router.get('/system/:systemName', systemController.getSystems);
router.get('/class/:className', systemController.getSystemsByClass);
router.get('/date', systemController.getSystemsByDate);
router.get('/list', systemController.getListSystemsToClasses);

module.exports = router;
