const { response } = require("express");
const express = require("express");
const router = express.Router();
const signuptemp = require("../models/signupmodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const repairmodel = require("../models/repair");


//register
router.post("/register", async (req, res) => {
  const usercheck = await signuptemp.findOne({ username: req.body.username });
  const emailcheck = await signuptemp.findOne({ email: req.body.email });
  const phonecheck = await signuptemp.findOne({ phone: req.body.phone });
  if (usercheck == null && emailcheck == null && phonecheck == null) {
    const saltpwd = await bcrypt.genSalt(10);
    const securepassword = await bcrypt.hash(req.body.password, saltpwd);
    const signupuser = new signuptemp({
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      password: securepassword,
    });
    signupuser
      .save()
      .then((data) => {
        res.send(data);
      })
      .catch((e) => {
        res.json(e);
      });
  } else if (usercheck != null) {
    res.send("userexist");
  } else if (emailcheck != null) {
    res.send("emailexist");
  } else if (phonecheck != null) {
    res.send("phoneexist");
  }
});


//repair backend module
router.post("/repair", async (req, res) => {
  const username = req.body.username;
  const name = req.body.name;
  const phone = req.body.phone;
  const carname = req.body.carname;
  const date = req.body.date;
  const time = req.body.time;
  const city = req.body.city;
  if (username == null) {
    res.send("Please Login");
  } else if (name == "") {
    res.send("Enter Name");
  } else if (phone == "") {
    res.send("Enter Phone number");
  } else if (carname == "") {
    res.send("Enter CarName");
  } else if (date == "") {
    res.send("Select Date");
  } else if (time == "") {
    res.send("Select Time");
  } else if (city == "") {
    res.send("Enter City");
  } else {
    const repair = new repairmodel({
      username: username,
      name: name,
      phone: phone,
      carname: carname,
      date: date,
      time: time,
      city: city,
    });
    try {
      await repair.save();
      res.send("success");
    } catch (err) {
      console.log(err);
      res.send("Not saved");
    }
  }
});



//login 
router.post("/login", async (req, res) => {
  const usercheck = await signuptemp.findOne({ username: req.body.username });
  if (usercheck == null) {
    res.send("newuser");
  } else {
    const validate = await bcrypt.compare(
      req.body.password,
      usercheck.password
    );
    if (!validate) {
      res.send("invalid");
    } else {
      signuptemp
        .findOne({ username: req.body.username })
        // if email exists
        .then((user) => {
          // compare the password entered and the hashed password found
          bcrypt
            .compare(req.body.password, user.password)
            // if the passwords match
            .then((passwordCheck) => {
              // check if password matches
              if (!passwordCheck) {
                return res.status(400).send({
                  message: "Passwords does not match",
                  error,
                });
              }
              //   create JWT token
              const token = jwt.sign(
                {
                  userId: user._id,
                  userEmail: user.email,
                  userRole: user.role,
                },
                "RANDOM-TOKEN",
                { expiresIn: "2h" }
              );

              //   return success response
              res.status(200).send({
                message: "Login Successful",
                username: user.username,
                role: user.role,
                token,
              });
            })
            // catch error if password does not match
            .catch((error) => {
              res.status(400).send({
                message: "Passwords does not match",
                error,
              });
            });
        })
        // catch error if email does not exist
        .catch((e) => {
          res.status(404).send({
            message: "Email not found",
            e,
          });
        });
    }
  }
});

// contact 









module.exports = router;
