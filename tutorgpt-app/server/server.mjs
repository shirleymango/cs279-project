import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import { callOpenAI } from "./openai.mjs";

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/submit-form", upload.single("file"), async (req, res) => {
  try {
    const { question, userUnderstanding, userConfusion } = req.body;
    const uploadedPdf = req.file;

    // Call the OpenAI API with the form data
    const response = await callOpenAI(
      question,
      userUnderstanding,
      userConfusion,
      uploadedPdf
    );

    // Send back the response from OpenAI to the frontend
    res.json({ message: "Success", response: response });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
