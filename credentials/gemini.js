const { GoogleGenerativeAI } = require("@google/generative-ai")

const genAI = new GoogleGenerativeAI("AIzaSyCbSAQDH8pcvKzpr7n591MFt9v7o5NlZSI");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

module.exports = {genAI, model}