const fs = require('fs');
const express = require('express');
const Papa = require('papaparse');

const app = express();

// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Hello from the server.', app: 'ruwdel' });
// });

const systems = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/systems-total.json`)
);

app.get('/api/v1/systems', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      systems,
    },
  });
});

app.get('/api/v1/systems/:system', (req, res) => {
  const rawSystem = Papa.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/by-system.csv`, 'utf8'),
    {
      header: true,
    }
  );

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
    results: bySystem.length,
    data: {
      bySystem,
    },
  });
});

app.get('/api/v1/classes/:class', (req, res) => {
  const rawSystem = Papa.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/by-system.csv`, 'utf8'),
    {
      header: true,
    }
  );

  const listOfClasses = Papa.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/classes.csv`, 'utf8'),
    {
      header: true,
    }
  );
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
    results: systemsByClass.length,
    systems: arrayOfSystems,
    data: {
      systemsByClass,
    },
  });
});

app.get('/api/v1/dates/:yyyymmdd', (req, res) => {
  const csv = fs.readFileSync(
    `${__dirname}/dev-data/data/daily-systems/${req.params.yyyymmdd}.csv`,
    'utf8'
  );

  const dateSystems = Papa.parse(csv, {
    header: true,
  });

  res.status(200).json({
    status: 'success',

    data: {
      systems: dateSystems,
    },
  });
});

app.get('/api/v1/list', (req, res) => {
  const csv = fs.readFileSync(`${__dirname}/dev-data/data/classes.csv`, 'utf8');

  const classesToSystems = Papa.parse(csv, {
    header: true,
  });

  res.status(200).json({
    status: 'success',

    data: {
      systems: classesToSystems,
    },
  });
});

const port = 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
