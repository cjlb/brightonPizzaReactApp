const express = require("express");
const { check, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middleware/auth")
const sanitize = require('mongo-sanitize');
const User = require("../model/User");
const fetch = require('node-fetch');
//const { request } = require("express");

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp POST request
 */

router.post(
    "/register",
    [
        //sanitize email and password, prevent SQLI attack
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        })
    ],
    async (req, res) => {
        //validate email and password
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
  
            return res.status(400).json({
                errors: errors.array(),
            });
        }
        //extract information from request
        const {
            email,
            password,
            firstName,
            lastName,
            dob,
            streetAddress,
            city,
            county
        } = req.body;
        try {
            sanitize(email);
            let user = await User.findOne({
                email
            });
            if (user) {
                return res.status(400).json({
                    msg: "User Already Exists"
                });
            }

            //now sanitize the input to prevent MONGODB injection
            sanitize(firstName);
            sanitize(lastName);
            sanitize(dob);
            sanitize(streetAddress);
            sanitize(city);
            sanitize(county);
            //password attempts
            var attempts = 0;
            //is account locked?
            var locked = false; 

            user = new User({
                email,
                password,
                firstName,
                lastName,
                dob,
                address : {
                  streetAddress,
                  city,
                  county
                },
                attempts,
                locked
            });

            //encrypt password using salt
            const salt = await bcrypt.genSalt(10);
            //bcrypt is based on blowfish
            user.password = await bcrypt.hash(password, salt);

            //save user to database
            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };
            //generate JSON web token using random string with a timeout
            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).json({
              msg: "Error in Saving"
            });
        }
    }
);

//login POST request
router.post(
    "/login",
    [
      check("email", "Password or Username incorrect").isEmail(),
      check("password", "Password or Username incorrect").isLength({
        min: 6
      })
    ],
    async (req, res) => {
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }
  
      const { email, password, captchaToken } = req.body;
      try {
        let human = await validateHuman(captchaToken);
        console.log("Human:" + human);
        if( !human ){
          return res.status(400).json({
            msg: "Bot"
          })
        }
        
        sanitize(email);
        let user = await User.findOne({
          email
        });
        if (!user)
          return res.status(400).json({
            msg: "Username or password incorrect"
          });

        if(user.locked){
          return res.status(400).json({
            msg: "Account locked, contact administrator"
          });
        }
  
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
          var attemptsStore = user.attempts;
          user.attempts += 1;
          if((attemptsStore+1) === 3){
            user.locked = true;
          }
          await user.save();
          return res.status(400).json({
            msg: "Username or password incorrect"
          });
        } else if(isMatch){
          user.attempts = 0;
        }
        const payload = {
          user: {
            id: user.id
          }
        };
  
        jwt.sign(
          payload,
          "randomString",
          {
            expiresIn: 3600
          },
          (err, token) => {
            if (err) throw err;
            res.status(200).json({
              token
            });
          }
        );
      } catch (e) {
        console.error(e);
        res.status(500).json({
          message: "Server Error"
        });
      }
    }
  );

/**
 * @method - GET
 * @description - Get LoggedIn User
 * @param - /user/me
 */
router.get("/me", auth, async (req, res) => {
    try {
      // request.user is getting fetched from Middleware after token authentication
      const user = await User.findById(req.user.id);
      res.json(user);
    } catch (e) {
      res.send({ message: "Error in Fetching user" });
    }
  });

/**
 * @method - POST
 * @description - User change password
 * @param - /user/change
 */
router.post(
  "/change", auth,
  [
    check("newPassword", "Password incorrect").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    // request.user is getting fetched from Middleware after token authentication
    //prevents CSRF, request will only be processed further if token 
    const { currentPassword, newPassword } = req.body;
    try {
      const user = await User.findById(req.user.id);
      //compare passwords
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res.status(400).json({
          msg: "Password incorrect"
        });
      //encrypt new password using salt
      const salt = await bcrypt.genSalt(10);
      //bcrypt is based on blowfish
      user.password = await bcrypt.hash(newPassword, salt);

      //save user to database
      await user.save();
      console.log("PASSWORD CHANGED")
      res.status(200).json({
        msg: "Password changed successfully"
      });

      
    } catch (e) {
      console.error(e);
      res.send({ msg: "Error in Fetching user" });
    }
  }
);

async function validateHuman(token) {
  var success = false;
  const secret = "6LcPzP4ZAAAAAD_FZl_TteP-JOtBbGFshj2RGiLD";
  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secret + "&response=" + token;
  const response = await fetch(verificationUrl, {method: "POST"});

  const data = await response.json();
  console.log(data);
  return data.success;
  
};



module.exports = router;
