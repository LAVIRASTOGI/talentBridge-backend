const bcrypt = require("bcrypt");
const saltRounds = 10;
async function encryptPassword(password) {
  let hashPassword = "";
  hashPassword = await bcrypt.hash(password, saltRounds);
  return hashPassword;
}

module.exports = { encryptPassword };
