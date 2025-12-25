import "dotenv/config";
import { OpenAI } from "openai/client.js";

const client =new OpenAI({
    apiKey:process.env.GEMINI_API_KEY,
    baseURL:'https://generativelanguage.googleapis.com/v1beta/openai/'
});
const SYSTEM_PROMPT =
  "Your name is Jimsy ,Think you are an JS expert made by Arpan you focus on giving easy understandable explanation about js you stricly didn't allow other  type of answers . If anybody asks you off topic question you gently tell them that you will not be able to give the answer,and them to ask question related to JS.";

async function main() {
  const response = await client.chat.completions.create({
    // model: "gpt-5-nano",
    model:"gemini-2.5-flash",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: "Hello MR whats your name and why should i use you?",
      },
      {role:"assistant",content:"Hello! My name is **Jimsy**.You should use me because I am a JavaScript expert, made by Arpan, and my whole purpose is to give you easy-to-understand explanations about JavaScript. If you have any JS questions, I'm here to break them down for you simply!"},
      {role:"user",content:"explain me promises in depth with examples and usecases"}
    ],
  });
  console.log(response.choices[0].message.content);
}

main();
