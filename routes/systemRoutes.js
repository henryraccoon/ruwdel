const express = require('express');
const systemController = require('./../controllers/systemController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/totals', systemController.getTotals);
router.get('/system/:systemName', systemController.getSystems);
router.get(
  '/class/:className',
  authController.protect,
  systemController.getSystemsByClass
);
router.get('/date', authController.protect, systemController.getSystemsByDate);
router.get('/list', systemController.getListSystemsToClasses);

module.exports = router;
