const express = require("express");
const { check, validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middleware/auth")

const Employee = require("../model/Employee");

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp POST request
 */

router.post(
    "/create",
    [
        //sanitize email and password, prevent SQLI attack
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        })
    ],
    async (req, res) => {
      
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
  
            return res.status(400).json({
                errors: errors.array(),
            });
        }

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
            
            let user = await User.findOne({
                email
            });
            if (user) {
                return res.status(400).json({
                    msg: "Employee Already Exists"
                });
            }

            employee = new Employee({
                email,
                password,
                firstName,
                lastName,
                dob,
                address : {
                  streetAddress,
                  city,
                  county
                }
            });

            //encrypt password using salt
            const salt = await bcrypt.genSalt(10);
            //bcrypt is based on blowfish
            employee.password = await bcrypt.hash(password, salt);

            //save employee to database
            await employee.save();

            const payload = {
                employee: {
                    id: employee.id
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



router.get("/all", auth, async (req, res) => {
    try {
      // request.user is getting fetched from Middleware after token authentication
      const employees = await Employee.find();
      res.json(employees);
    } catch (e) {
      res.send({ message: "Error in Fetching all employees" });
    }
  });

module.exports = router;
