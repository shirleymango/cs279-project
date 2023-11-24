import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY, // Ensure your API key is loaded from environment variables
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "Translate 'hello!' to Spanish." }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);
}

main();

// const https = require("https");

// const data = JSON.stringify({
//   prompt:
//     "Translate the following English text to French: 'Hello, how are you?'",
//   temperature: 0.7,
//   max_tokens: 60,
//   top_p: 1.0,
//   frequency_penalty: 0.0,
//   presence_penalty: 0.0,
// });

// const options = {
//   hostname: "api.openai.com",
//   port: 443,
//   path: "/v1/engines/davinci/completions",
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     "Content-Length": data.length,
//     Authorization: `Bearer ${process.env.OPENAI_KEY}`,
//   },
// };

// const req = https.request(options, (res) => {
//   let response = "";

//   res.on("data", (chunk) => {
//     response += chunk;
//   });

//   res.on("end", () => {
//     console.log(JSON.parse(response));
//   });
// });

// req.on("error", (error) => {
//   console.error(error);
// });

// req.write(data);
// req.end();
