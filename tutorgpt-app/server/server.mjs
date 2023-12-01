import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { callOpenAI } from "./openai.mjs";

dotenv.config();

const app = express();
// const upload = multer({ storage: multer.memoryStorage() });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File handling
const uploadDirectory = "uploads";
fs.mkdirSync(uploadDirectory, { recursive: true });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

app.post("/api/submit-form", upload.single("file"), async (req, res) => {
  try {
    const { question, userUnderstanding, userConfusion, threadId } = req.body;
    const uploadedPdf = req.file;
    const uploadedFilePath = uploadedPdf ? uploadedPdf.path : null;

    // Call the OpenAI API with the form data
    const { response, thread } = await callOpenAI(
      question,
      userUnderstanding,
      userConfusion,
      uploadedFilePath,
      threadId
    );

    // Send back the response from OpenAI to the frontend
    res.json({ message: "Success", response: response, thread: thread });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
