// routes/laundry.js
const express = require("express");
const User = require("../models/user");
const LaundryPickup = require("../models/laundry-pickup");
const router = express.Router();

router.get('/dashboard', (req, res, next) => {
  let query;

  if (req.session.passport.user.isLaunderer) {
    query = { launderer: req.session.passport.user };
  } else {
    query = { user: req.session.passport.user };
  }
console.log(query)
  LaundryPickup
    .find(query)
    .populate('user', 'username')
    .populate('launderer', 'username')
    .sort('pickupDate')
    .exec((err, pickupDocs) => {
      if (err) {
        next(err);
        return;
      }
      console.log(pickupDocs)
      res.render('laundry/dashboard', {
        pickups: pickupDocs
      });
    });
});

router.post("/launderers", (req, res, next) => {
  const userId = req.session.passport.user;
  const laundererInfo = {
    fee: req.body.fee,
    isLaunderer: true
  };

  User.findByIdAndUpdate(
    userId,
    laundererInfo,
    { new: true },
    (err, theUser) => {
      if (err) {
        next(err);
        return;
      }

      req.session.passport.user = theUser;

      res.redirect("/dashboard");
    }
  );
});

router.get("/launderers", (req, res, next) => {
  User.find({ isLaunderer: true }, (err, launderersList) => {
    if (err) {
      next(err);
      return;
    }

    res.render("laundry/launderers", {
      launderers: launderersList
    });
  });
});

router.get("/launderers/:id", (req, res, next) => {
  const laundererId = req.params.id;

  User.findById(laundererId, (err, theUser) => {
    if (err) {
      next(err);
      return;
    }

    res.render("laundry/launderer-profile", {
      theLaunderer: theUser
    });
  });
});

router.post("/laundry-pickups", (req, res, next) => {
  const pickupInfo = {
    pickupDate: req.body.pickupDate,
    launderer: req.body.laundererId,
    user: req.session.passport.user
  };

  const thePickup = new LaundryPickup(pickupInfo);

  thePickup.save(err => {
    if (err) {
      next(err);
      return;
    }

    res.redirect("/dashboard");
  });
});

module.exports = router;
