var validator = require("validator");
function validateHandlerSignUp(validateData) {
  const { name, username, password, emailId, phoneNumber } = validateData;

  if (!name || !username) {
    throw new Error("First name and username are required");
  }
  if (!(name?.length > 3 && name?.length < 100)) {
    throw new Error(" name should be between 3 and 100 characters");
  }
  if (!emailId) {
    throw new Error("Email is required");
  }
  if (!password) {
    throw new Error("Password is required");
  }
  if (password?.length < 8) {
    throw new Error("Password should be at least 8 characters");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Password should be contain atleast 1 numeric character");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  }
}
function validateHandlerLogin(validateData) {
  const { password, email_username } = validateData;
  if (!password) {
    throw new Error("Password is required");
  }
  if (!email_username) {
    throw new Error("Email/UserName is required");
  }
}

function validateEditProfile(req, AllowedFeildsToUpdate) {
  const feildsToUpdate = Object.keys(req.body);
  const isUpdateAllowed = feildsToUpdate.every((feild) => {
    return AllowedFeildsToUpdate.includes(feild);
  });
  if (!isUpdateAllowed) {
    throw new Error("Invalid feilds to update");
  }
  if (req?.body?.skills && req?.body?.skills?.length > 10) {
    throw new Error("Skills cannot be more than 10");
  }
}

module.exports = {
  validateHandlerSignUp,
  validateHandlerLogin,
  validateEditProfile,
};
