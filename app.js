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
