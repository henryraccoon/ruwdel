const express = require('express');
const AllSystem = require('./../models/allSystemModel');
const TotalSystem = require('../models/totalSystemModel');
const SystemsToClasses = require('../models/systemsToClassesModel');
const System = require('../models/dailySystemModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getTotals = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query };

  const query = TotalSystem.find(queryObj);

  const totals = await query;

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      totals,
    },
  });
});

exports.getSystems = catchAsync(async (req, res, next) => {
  const querySystem = req.params.systemName;
  const queryObj = { ...req.query };
  queryObj.system = new RegExp(querySystem, 'i');

  const query = AllSystem.find(queryObj);

  const bySystem = await query;

  if (bySystem.length < 1) {
    return next(
      new AppError(
        `Oops! Nothing was found. Please double check if the system name is correct. You can find all system names at /api/v1/systems/list`,
        404
      )
    );
  }

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: bySystem.length,
    data: {
      bySystem,
    },
  });
});

exports.getSystemsByClass = catchAsync(async (req, res, next) => {
  const list = await SystemsToClasses.find({
    class: new RegExp(req.params.className, 'i'),
  });
  if (list.length < 1) {
    return next(
      new AppError(
        `Class ${req.params.className} not found. Please check list of classes at /api/v1/systems/list`,
        404
      )
    );
  }
  const regexQueries = list[0].systems.map((name) => new RegExp(name, 'i'));

  const queryObj = { ...req.query };
  queryObj.system = { $in: regexQueries };

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
});

exports.getSystemsByDate = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query };
  if (req.query.system) queryObj.system = new RegExp(req.query.system, 'i');

  const query = System.find(queryObj);

  const systemsByDate = await query;

  if (systemsByDate.length < 1) {
    return next(
      new AppError(
        `Oops! Nothing was found. Please double check if the date is in format mm/dd/yyyy and if the date is in the period between 02/24/2022 and ${new Date(
          Date.now()
        ).toLocaleDateString('en-US')}`,
        404
      )
    );
  }

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: systemsByDate.length,

    data: {
      systems: systemsByDate,
    },
  });
});

exports.getListSystemsToClasses = catchAsync(async (req, res, next) => {
  const list = await SystemsToClasses.find();

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,

    data: {
      systemsToClasses: list,
    },
  });
});
