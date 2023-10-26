const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log('DB connection sucessful.'));

const app = require('./app');

const port = process.env.PORT || 6000;
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
