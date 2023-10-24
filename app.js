const fs = require('fs');
const express = require('express');
const Papa = require('papaparse');
const morgan = require('morgan');

const app = express();
app.use(express.json());

// 1. Middlewares

app.use(morgan('dev'));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const systemsTotals = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/systems-total.json`)
);

const rawSystem = Papa.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/by-system.csv`, 'utf8'),
  {
    header: true,
    skipEmptyLines: true,
  }
);

const listOfClasses = Papa.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/classes.csv`, 'utf8'),
  {
    header: true,
    skipEmptyLines: true,
  }
);

// 2. Route Handlers

const getTotals = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      systemsTotals,
    },
  });
};

const getSystems = (req, res) => {
  const bySystem = rawSystem.data.filter((field) => {
    if (field.system && req.params.system) {
      return field.system
        .toLowerCase()
        .includes(req.params.system.toLowerCase());
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

const getSystemsByClass = (req, res) => {
  const arrayOfSystems = [];

  const systemsInClass = listOfClasses.data.filter((field) => {
    if (field.class && req.params.class) {
      if (
        field.class.toLowerCase().includes(req.params.class.toLowerCase()) &&
        !field.class
          .toLowerCase()
          .includes(`Anti-${req.params.class}`.toLowerCase())
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

const getSystemsByDate = (req, res) => {
  const SystemsByDate = Papa.parse(
    fs.readFileSync(
      `${__dirname}/dev-data/data/daily-systems/${req.params.yyyymmdd}.csv`,
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

const getListSystemsToClasses = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,

    data: {
      systemsToClasses: listOfClasses.data,
    },
  });
};

// 3. Routes

app.get('/api/v1/systems', getTotals);

app.get('/api/v1/systems/:system', getSystems);

app.get('/api/v1/classes/:class', getSystemsByClass);

app.get('/api/v1/dates/:yyyymmdd', getSystemsByDate);

app.get('/api/v1/list', getListSystemsToClasses);

// 4) Start Server

const port = 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
