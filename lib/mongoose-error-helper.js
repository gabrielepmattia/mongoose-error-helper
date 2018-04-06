/**
 * Created with IntelliJ IDEA.
 * User: sebastianbromberg
 * Date: 12/8/13
 * Time: 15:58
 * To change this template use File | Settings | File Templates.
 */
var util = require('util');

const DUP_KEY = 11000;
const TYPE_MISMATCH = 2;

exports.errorHelper = function errorHelper(err) {
  // A validationerror can contain more than one error.
  var errors = [];

  //If it isn't a mongoose-validation error, just throw it.
  if (err.name === 'ValidationError') {
    var messages = {
      'required': "%s is required.",
      'min': "%s below minimum.",
      'max': "%s above maximum.",
      'enum': "%s not an allowed value."
    };

    //Loop over the errors object of the Validation Error
    Object.keys(err.errors).forEach(function(field) {
      var eObj = err.errors[field];

      //If we don't have a message for2 `type`, just push the error through
      if (!messages.hasOwnProperty(eObj.kind)) errors.push(eObj.kind);

      //Otherwise, use util.format to format the message, and passing the path
      else errors.push(util.format(messages[eObj.kind], eObj.path));
    });

  } else if (err.name === 'MongoError') {
    switch (err.code) {
      case DUP_KEY:
        errors.push("entity already exists")
        break;
        case TYPE_MISMATCH:
        errors.push(err.errmsg)
        break;
      default:
        break;
    }
  } else return err;

  return { errors: errors };
}
