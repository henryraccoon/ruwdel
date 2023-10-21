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

// app.get('/api/v1/systems/:system', async (req, res) => {
//   try {
//     const csvData = await fs.promises.readFile(
//       `${__dirname}/dev-data/data/by-system.csv`,
//       'utf8'
//     );
//     const rawSystem = Papa.parse(csvData, { header: true });

//     if (rawSystem.errors.length === 0) {
//       const bySystem = rawSystem.data.filter((field) => {
//         if (field.system && req.params.system) {
//           return field.system
//             .toLowerCase()
//             .includes(req.params.system.toLowerCase());
//         }
//         return false;
//       });

//       res.status(200).json({
//         status: 'success',
//         results: bySystem.length,
//         data: {
//           bySystem,
//         },
//       });
//     } else {
//       res.status(500).json({
//         status: 'error',
//         message: 'Error parsing CSV file',
//         errors: rawSystem.errors,
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       status: 'error',
//       message: 'An error occurred while processing the request',
//     });
//   }
// });

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
