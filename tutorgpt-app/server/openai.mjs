import dotenv from "dotenv";
import readline from "readline";
import fs from "fs";

dotenv.config();

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY, // Ensure your API key is loaded from environment variables
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to ask question in terminal chatbot form
function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

// Run first time creating a new assistant
async function create_assistant() {
  const assistant = await openai.beta.assistants.create({
    name: "TutorGPT!",
    instructions:
      "You are an assistant meant to give hints on homework questions, but NEVER give the full answer. Only give small hints one at a time based on the user input. If the user uploads a file, NEVER give them answers from the file. Use the file to get information needed to help you give hints, but do NOT ever tell the user direct answers based on the file.",
    tools: [{ type: "retrieval" }],
    model: "gpt-3.5-turbo-1106",
  });

  console.log(assistant.id);
}

// Run to delete an existing assistant
async function deleteAssistant(id) {
  const deleting = await openai.beta.assistants.del(id);
}

// Asking a single question, testing API
async function askSingleQuestion() {
  const myAssistantId = process.env.assistant_id;
  const assistant = await openai.beta.assistants.retrieve(myAssistantId);

  const thread = await openai.beta.threads.create();

  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: "How do I solve the equation `3x + 11 = 14`?",
  });

  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
  });
  let runStatus = (await openai.beta.threads.runs.retrieve(thread.id, run.id))
    .status;

  // Polling loop
  while (runStatus !== "completed") {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2-second delay

    const updatedRun = (
      await openai.beta.threads.runs.retrieve(thread.id, run.id)
    ).status;
    runStatus = updatedRun;
    if (runStatus === "completed" || runStatus === "failed") {
      break;
    }
  }

  const complete_run = await openai.beta.threads.runs.retrieve(
    thread.id,
    run.id
  );

  const messages = await openai.beta.threads.messages.list(thread.id);

  messages.data.forEach((message) => {
    console.log("Message ID:", message.id);
    console.log("Content:", JSON.stringify(message.content, null, 2));
  });
}

// Chatbot form question asking
async function commandline_chatbot() {
  const myAssistantId = process.env.assistant_id;
  const assistant = await openai.beta.assistants.retrieve(myAssistantId);

  const thread = await openai.beta.threads.create();

  while (true) {
    const userMessage = await askQuestion("You: ");
    if (userMessage.toLowerCase() === "exit") {
      console.log("Exiting chatbot...");
      rl.close();
      break;
    }

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: userMessage,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });

    let runStatus = (await openai.beta.threads.runs.retrieve(thread.id, run.id))
      .status;
    while (runStatus !== "completed") {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2-second delay
      runStatus = (await openai.beta.threads.runs.retrieve(thread.id, run.id))
        .status;
    }

    // Get the complete run with the response
    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantResponse = messages.data[0]; // Assuming the last message is the response

    console.log("");
    console.log("Assistant:", assistantResponse.content[0].text.value);
    console.log("");
  }
}

export async function callOpenAI(
  question,
  userUnderstanding,
  userConfusion,
  uploadedPdf,
  threadId
) {
  // open thread with OpenAI Assistant API
  const myAssistantId = process.env.assistant_id;
  const assistant = await openai.beta.assistants.retrieve(myAssistantId);

  // Upload pdf to openai if provided
  let fileId = null;
  if (uploadedPdf) {
    const fileUploadResponse = await openai.files.create({
      file: fs.createReadStream(uploadedPdf),
      purpose: "assistants",
    });
    fileId = fileUploadResponse.id;
    // Use for updating to whole assistant, not just one thread:
    // const myAssistantFile = await openai.beta.assistants.files.create(
    //   myAssistantId,
    //   {
    //     file_id: fileId,
    //   }
    // );
    // console.log(myAssistantFile);
  }
  // Prompt constructed based on user input
  const prompt = `This is the question that I have: ${question}\n
  This is what my current understanding is: ${userUnderstanding}\n 
  This is the part I'm specifically confused about: ${userConfusion}\n 
  Use the file that I uploaded to help answer my question, but do NOT give full answers
  based on the file. Use the file to help me, but don't tell me what is on the file.\n
  Please give me a hint to help me answer my question based on my current understanding 
  and points of confusion, but do NOT give me the full answer. `;

  let thread;
  // start new thread or append to existing thread
  if (threadId && threadId !== "null") {
    thread = await openai.beta.threads.retrieve(threadId);
  } else {
    thread = await openai.beta.threads.create();
  }

  // adding prompt and/or file to thread
  if (fileId !== null) {
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: prompt,
      file_ids: [fileId],
    });
  } else {
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: prompt,
    });
  }

  // get response from chatgpt
  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
  });
  let runStatus = (await openai.beta.threads.runs.retrieve(thread.id, run.id))
    .status;
  while (runStatus !== "completed") {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    runStatus = (await openai.beta.threads.runs.retrieve(thread.id, run.id))
      .status;
  }

  // return response
  const messages = await openai.beta.threads.messages.list(thread.id);
  const assistantResponse = messages.data[0];
  return {
    response: assistantResponse.content[0].text.value,
    thread: thread.id,
  };
}
