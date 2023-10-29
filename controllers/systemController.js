const express = require('express');
const AllSystem = require('./../models/allSystemModel');
const TotalSystem = require('../models/totalSystemModel');
const SystemsToClasses = require('../models/systemsToClassesModel');
const { DailySystem } = require('../models/dailySystemModel');

exports.getTotals = async (req, res) => {
  try {
    const totals = await TotalSystem.find();

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
    const query = req.params.systemName;
    const bySystem = await AllSystem.find({ system: new RegExp(query, 'i') });

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
    console.log(list[0].systems);
    const regexQueries = list[0].systems.map((name) => new RegExp(name, 'i'));

    const systemsByClass = await AllSystem.find({
      system: { $in: regexQueries },
    });

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
