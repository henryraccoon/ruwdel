const Papa = require('papaparse');
const AllSystem = require('./models/allSystemModel');
const TotalSystem = require('./models/totalSystemModel');
const SystemsToClasses = require('./models/systemsToClassesModel');
// const System = require('./models/dailySystemModel');
const System = require('./models/dailySystemModel');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log('DB connection sucessful.'));

const owner = 'leedrake5';
const repo = 'Russia-Ukraine';

////////// ALLSYSTEMS

const importAllSystemData = async () => {
  try {
    const filePath = 'data/bySystem/Raw/Full/2023-10-28.csv';

    const apiUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${filePath}`;
    const response = await axios.get(apiUrl);
    const allSystem = Papa.parse(response.data, {
      header: true,
      skipEmptyLines: true,
    });

    await AllSystem.create(allSystem.data);
    console.log('Data successfully loaded.');
  } catch (err) {
    console.log(err);
  }
};

// importAllSystemData();

///////////////TOTALS

const importTotalsData = async () => {
  try {
    const filePath = 'data/byType/2023-10-25.csv';

    const apiUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${filePath}`;
    const response = await axios.get(apiUrl);
    const totals = Papa.parse(response.data, {
      header: true,
      skipEmptyLines: true,
    });
    await TotalSystem.create(totals.data);
    console.log('Data successfully loaded.');
  } catch (error) {
    console.error('Error:', error);
  }
};

// importTotalsData();

//////DAILY

const importDailyData = async () => {
  try {
    const folderPath = 'data/bySystem/Raw/Daily';

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${folderPath}`;
    const response = await axios.get(apiUrl);
    const files = response.data;
    const csvFiles = files.filter(
      (file) => file.type === 'file' && file.name.endsWith('.csv')
    );

    for (const file of csvFiles) {
      const fileUrl = file.download_url;
      const fileContent = (await axios.get(fileUrl)).data;

      const parsedData = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
      });

      const systemInstance = await System.create(parsedData.data);

      console.log(`File: ${file.name} successfully loaded.`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

importDailyData();

////// CLASSES LIST

// const filePath = 'data/classes.csv';

// const apiUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${filePath}`;

// const importClassesData = async () => {
//   try {
//     const response = await axios.get(apiUrl);
//     const rawClasses = Papa.parse(response.data, {
//       header: true,
//       skipEmptyLines: true,
//     });

//     const systemsByClass = rawClasses.data.reduce((result, item) => {
//       const existingClass = result.find((el) => el.class === item.class);
//       if (existingClass) {
//         existingClass.systems.push(item.system);
//       } else {
//         result.push({
//           class: item.class,
//           systems: [item.system],
//         });
//       }
//       return result;
//     }, []);

//     await SystemsToClasses.create(systemsByClass);
//     console.log('Data successfully loaded.');
//   } catch (error) {
//     console.error('Error:', error);
//   }
// };

// importClassesData();

// DELETE ALL DATA

const deleteData = async () => {
  try {
    await AllSystem.deleteMany();
    await TotalSystem.deleteMany();
    console.log('Data successfully deleted.');
  } catch (err) {
    console.log(err);
  }
};

// process.exit(1);
