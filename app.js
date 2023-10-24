const express = require('express');
const morgan = require('morgan');
const systemRouter = require('./routes/systemRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

app.use(express.json());

app.use(morgan('dev'));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/systems', systemRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
