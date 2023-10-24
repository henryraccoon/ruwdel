const express = require('express');
const fs = require('fs');
const Papa = require('papaparse');

const systemsTotals = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/systems-total.json`)
);

const rawSystem = Papa.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/by-system.csv`, 'utf8'),
  {
    header: true,
    skipEmptyLines: true,
  }
);

const listOfClasses = Papa.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/classes.csv`, 'utf8'),
  {
    header: true,
    skipEmptyLines: true,
  }
);

exports.getTotals = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      systemsTotals,
    },
  });
};

exports.getSystems = (req, res) => {
  const bySystem = rawSystem.data.filter((field) => {
    if (field.system && req.params.systemName) {
      return field.system
        .toLowerCase()
        .includes(req.params.systemName.toLowerCase());
    }
    return false;
  });

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: bySystem.length,
    data: {
      bySystem,
    },
  });
};

exports.getSystemsByClass = (req, res) => {
  const arrayOfSystems = [];

  const systemsInClass = listOfClasses.data.filter((field) => {
    if (field.class && req.params.className) {
      if (
        field.class
          .toLowerCase()
          .includes(req.params.className.toLowerCase()) &&
        !field.class
          .toLowerCase()
          .includes(`Anti-${req.params.className}`.toLowerCase())
      ) {
        return arrayOfSystems.push(field.system);
      }
    }
    return false;
  });

  const systemsByClass = rawSystem.data.filter((field) =>
    arrayOfSystems.includes(field.system)
  );

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: systemsByClass.length,
    systems: arrayOfSystems,
    data: {
      systemsByClass,
    },
  });
};

exports.getSystemsByDate = (req, res) => {
  const SystemsByDate = Papa.parse(
    fs.readFileSync(
      `${__dirname}/../dev-data/data/daily-systems/${req.params.yyyymmdd}.csv`,
      'utf8'
    ),
    {
      header: true,
      skipEmptyLines: true,
    }
  );

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: SystemsByDate.data.length,

    data: {
      systems: SystemsByDate.data,
    },
  });
};

exports.getListSystemsToClasses = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,

    data: {
      systemsToClasses: listOfClasses.data,
    },
  });
};
