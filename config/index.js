const dotenv = require("dotenv")
dotenv.config();

const authEmail = process.env.EMAIL
const googleAppPassword = process.env.GOOGLE_APP_PASSWORD

module.exports = {
    authEmail,
    googleAppPassword
}