const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  dob: {
    type: String,
    required: true
  },
  address: {
    "type": "object",
    "properties": {
      "street_address": { "type": "string" },
      "city":           { "type": "string" },
      "county":          { "type": "string" }
    },
    "required": ["street_address", "city", "state"]
  },
  attempts: {
    type: Number,
    required: true
  },
  locked: {
    type: Boolean,
    required: true
  }

  
});

// export model user with UserSchema
module.exports = mongoose.model("user", UserSchema);