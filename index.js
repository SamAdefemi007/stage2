const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/", async (req, res, next) => {
  let { operation_type, x, y } = req.body;
  let result;
  if (x && y) {
    x = parseInt(x);
    y = parseInt(y);
    operation_type = operation_type.trim().toLowerCase();
    switch (operation_type) {
      case "addition":
      case "add":
      case "plus":
      case "+":
        result = x + y;
        break;

      case "subtraction":
      case "subtract":
      case "minus":
      case "-":
        result = x - y;
        break;

      case "multiplication":
      case "multiply":
      case "times":
      case "*":
        result = x * y;
        break;
    }
  } else {
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: operation_type,
    });

    result = completion.data.choices[0].text;
  }

  res.send({
    slackUsername: "SamAdefemi",
    operation_type: operation_type,
    result: result.trim(),
  });
});

app.listen(9000, () => {
  console.log("listening on 9000");
});
