const express = require('express');
const morgan = require('morgan');
const systemRouter = require('./routes/systemRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARES

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/systems', systemRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
