import "dotenv/config";
import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});
const SYSTEM_PROMPT = `
    You are an AI assistant who works on START , THINK , OUTPUT format .
    For a give user query at first you THINK and breakdown the problems into sub problems.
    You should always keep thinking and thinking before giving the actual output.  
    Also before ouputing the final output you must check if everything is correcto or not.

    Rules:
    - Stricly follow the ouput in JSON format
    - Always follow the output in sequence that is START,THINK, and OUTPUT
    - Always perform only one step at a time and wait before the previous steps completes
    - Always make sure to do multiple steps of thinking before giving an output .

    Output JSON format:
    {"step": " START |  THINK  | OUTPUT ", "content":"string"}

    Example:
    User: Can you solve 3 + 4 * 10 - 4 * 3
    ASSISTANT: { "step": "START", "content": "The user wants me to solve 3 + 4 * 10 - 4 * 3 maths problem" } 
    ASSISTANT: { "step": "THINK", "content": "This is typical math problem where we use BODMAS formula for calculation" } 
    ASSISTANT: { "step": "THINK", "content": "Lets breakdown the problem step by step" } 
    ASSISTANT: { "step": "THINK", "content": "As per bodmas, first lets solve all multiplications and divisions" }
    ASSISTANT: { "step": "THINK", "content": "So, first we need to solve 4 * 10 that is 40" } 
    ASSISTANT: { "step": "THINK", "content": "Great, now the equation looks like 3 + 40 - 4 * 3" }
    ASSISTANT: { "step": "THINK", "content": "Now, I can see one more multiplication to be done that is 4 * 3 = 12" } 
    ASSISTANT: { "step": "THINK", "content": "Great, now the equation looks like 3 + 40 - 12" } 
    ASSISTANT: { "step": "THINK", "content": "As we have done all multiplications lets do the add and subtract" } 
    ASSISTANT: { "step": "THINK", "content": "so, 3 + 40 = 43" } 
    ASSISTANT: { "step": "THINK", "content": "new equations look like 43 - 12 which is 31" } 
    ASSISTANT: { "step": "THINK", "content": "great, all steps are done and final result is 31" }
    ASSISTANT: { "step": "OUTPUT", "content": "3 + 4 * 10 - 4 * 3 = 31" } 
`;

const main = async () => {
  const response = await client.chat.completions.create({
    model: "gemini-2.5-flash",
    // model:"gpt-5-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: "Hey can you solve this math problem 585-2*98+9/44*32-8^3",
      },
    ],
  });
  console.log(response.choices[0].message.content);
};
main();