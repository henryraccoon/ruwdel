const TotalSystem = require('../models/totalSystemModel');
const AllSystem = require('../models/allSystemModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  const totalsRu = await TotalSystem.find({ country: 'Russia' }).sort({
    equipment_type: 1,
  });

  const totalsUa = await TotalSystem.find({ country: 'Ukraine' }).sort({
    equipment_type: 1,
  });

  res.status(200).render('overview', {
    title: 'Total losses',
    totalsRu,
    totalsUa,
  });
});

exports.getSearch = catchAsync(async (req, res, next) => {
  // // const results = await AllSystem.find({
  // //   country: 'Ukraine',
  // });
  res.status(200).render('search', {
    title: 'Quick search',
    // results,
  });
});

exports.getLoginForm = (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getSignupForm = (req, res, next) => {
  res.status(200).render('signup', {
    title: 'Create a new account',
  });
};
