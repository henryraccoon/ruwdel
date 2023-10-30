const express = require('express');
const AllSystem = require('./../models/allSystemModel');
const TotalSystem = require('../models/totalSystemModel');
const SystemsToClasses = require('../models/systemsToClassesModel');
const { DailySystem } = require('../models/dailySystemModel');

exports.getTotals = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    const query = TotalSystem.find(queryObj);

    const totals = await query;

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: {
        totals,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getSystems = async (req, res) => {
  try {
    const querySystem = req.params.systemName;
    const queryObj = { ...req.query };
    queryObj.system = new RegExp(querySystem, 'i');
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    const query = AllSystem.find(queryObj);

    const bySystem = await query;

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: bySystem.length,
      data: {
        bySystem,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getSystemsByClass = async (req, res) => {
  try {
    const list = await SystemsToClasses.find({
      class: new RegExp(req.params.className, 'i'),
    });

    const regexQueries = list[0].systems.map((name) => new RegExp(name, 'i'));

    const queryObj = { ...req.query };
    queryObj.system = { $in: regexQueries };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    const query = AllSystem.find(queryObj);

    const systemsByClass = await query;

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: systemsByClass.length,
      systems: list.systems,
      data: {
        systemsByClass,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getSystemsByDate = async (req, res) => {
  try {
    const systemsByDate = await DailySystem.find({ date: req.params.yyyymmdd });

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: systemsByDate[0].systems.length,

      data: {
        systems: systemsByDate[0].systems,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getListSystemsToClasses = async (req, res) => {
  try {
    const list = await SystemsToClasses.find();

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,

      data: {
        systemsToClasses: list,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
