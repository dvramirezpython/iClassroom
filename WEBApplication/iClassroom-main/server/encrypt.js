const bcrypt = require("bcryptjs");

async function encrypt (password) {

  const hashedPassword = await bcrypt.hash(password, 10)
  return hashedPassword
}

function decrpyt(text_sent, hashed_password) {
  bcrypt.compare(text_sent, hashed_password, function(err, result) {
      return result
  });
}

module.exports = { encrypt, decrpyt }