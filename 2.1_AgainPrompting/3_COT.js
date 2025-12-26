import "dotenv/config";
import { OpenAI } from "openai";

const client = new OpenAI();
const client2 = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});
const SYSTEM_PROMPT = `
    You are an AI assistant who works on START , THINK ,EVALUATE ,OUTPUT format .
    For a give user query at first you THINK and breakdown the problems into sub problems.
    You should always keep thinking and thinking before giving the actual output.  
    After the thinking step someone will evaluate your thinking and give you a proper evalutaion , you have to use that feedback to improve your thinking.
    Also before ouputing the final output you must check if everything is correcto or not.

    Rules:
    - Stricly follow the ouput in JSON format
    - Always follow the output in sequence that is START,THINK,EVALUATE and OUTPUT
    - Always perform only one step at a time and wait before the previous steps completes
    - Always make sure to do multiple steps of thinking before giving an output .

    Output JSON format:
    {"step": " START |  THINK  | EVALUATE | OUTPUT ", "content":"string"}

    Example:
    User: Can you solve 3 + 4 * 10 - 4 * 3
    ASSISTANT: { "step": "START", "content": "The user wants me to solve 3 + 4 * 10 - 4 * 3 maths problem" } 
    ASSISTANT:{"step":"EVALUATE","content":"Yes buddy you are going one the right direction keep going"}
    ASSISTANT: { "step": "THINK", "content": "This is typical math problem where we use BODMAS formula for calculation" } 
    ASSISTANT:{"step":"EVALUATE","content":"Yes buddy you are going one the right direction keep going"}
    ASSISTANT: { "step": "THINK", "content": "Lets breakdown the problem step by step" } 
    ASSISTANT:{"step":"EVALUATE","content":"Yes buddy you are going one the right direction keep going"}
    ASSISTANT: { "step": "THINK", "content": "As per bodmas, first lets solve all multiplications and divisions" }
    ASSISTANT:{"step":"EVALUATE","content":"Yes buddy you are going one the right direction keep going"}
    ASSISTANT: { "step": "THINK", "content": "So, first we need to solve 4 * 10 that is 40" } 
    ASSISTANT:{"step":"EVALUATE","content":"Yes buddy you are going one the right direction keep going"}
    ASSISTANT: { "step": "THINK", "content": "Great, now the equation looks like 3 + 40 - 4 * 3" }
    ASSISTANT:{"step":"EVALUATE","content":"Yes buddy you are going one the right direction keep going"}
    ASSISTANT: { "step": "THINK", "content": "Now, I can see one more multiplication to be done that is 4 * 3 = 12" } 
    ASSISTANT:{"step":"EVALUATE","content":"Yes buddy you are going one the right direction keep going"}
    ASSISTANT: { "step": "THINK", "content": "Great, now the equation looks like 3 + 40 - 12" } 
    ASSISTANT:{"step":"EVALUATE","content":"Yes buddy you are going one the right direction keep going"}
    ASSISTANT: { "step": "THINK", "content": "As we have done all multiplications lets do the add and subtract" } 
    ASSISTANT:{"step":"EVALUATE","content":"Yes buddy you are going one the right direction keep going"}
    ASSISTANT: { "step": "THINK", "content": "so, 3 + 40 = 43" } 
    ASSISTANT:{"step":"EVALUATE","content":"Yes buddy you are going one the right direction keep going"}
    ASSISTANT: { "step": "THINK", "content": "new equations look like 43 - 12 which is 31" } 
    ASSISTANT:{"step":"EVALUATE","content":"Yes buddy you are going one the right direction keep going"}
    ASSISTANT: { "step": "THINK", "content": "great, all steps are done and final result is 31" }
    ASSISTANT:{"step":"EVALUATE","content":"Yes buddy you are going one the right direction keep going"}
    ASSISTANT: { "step": "OUTPUT", "content": "3 + 4 * 10 - 4 * 3 = 31" } 
`;
const SYSTEM_PROMPT2 = `
Act as an Expert Evaluator , you have to evaluate the thinking responce of another person/llm . You will get a content that will be thinking of another you have to evaluate that in a unbiased way if their responce will good you will say that keep going doing great, if you see anything that can be improve you will suggest that. 

 Rules:
  - Always evaluate without any bias
  - Be honest 
  - Tell the areas of improvement
  - If he is going on the right direction then say to keep going
  - If going on a wrong direction then tell them to get to write direction guide them
  
  Example:

    input: { "step": "THINK", "content": "3 + 4 * 10 - 4 * 3 This is typical math problem where we use BODMAS formula for calculation" } 
    output :  { "step": "EVALUATE", "content": "Yes buddy you are going one the right direction keep going" } 

    input:  { "step": "THINK", "content": "I can see the equation looks like 3  + 4 * 10 - 4 * 3 so we should do 10-4 first" }  
    output :  { "step": "EVALUATE", "content": "You are doing it wrong at first the * will get calculated not the + or -, so do 4*10 and 4*3 first" } 

`;

const evaluate = async (param) => {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT2 },
    { role: "user", content: JSON.stringify(param) },
  ];
  let response;
  try {
    response = await client2.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: messages,
    });
  } catch (error) {
    console.log(error.message);
    return;
  }
  const rawContent = response.choices[0].message.content;
  try {
    const parsedContent = JSON.parse(rawContent);
    messages.push({
      role: "assistant",
      content: JSON.stringify(parsedContent),
    });
    return parsedContent.content;
  } catch (error) {
    console.log("unable to parse content", error.message);
    return;
  }
};
const main = async () => {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: "How to reduce lazyness? ",
    },
  ];

  while (true) {
    const response = await client.chat.completions.create({
      //   model: "gemini-2.5-flash",
      model: "gpt-5-nano",
      messages: messages,
    });
    const rawContent = response.choices[0].message.content;
    const parsedContent = JSON.parse(rawContent);
    messages.push({
      role: "assistant",
      content: JSON.stringify(parsedContent),
    });

    if (parsedContent.step === "START") {
      console.log(`🔥`, parsedContent.content);
      continue;
    }
    if (parsedContent.step === "THINK") {
      console.log(`🧠`, parsedContent.content);

      const evaluation = await evaluate(parsedContent);
      console.log(`👀`, evaluation);

      messages.push({
        role: "user",
        content: JSON.stringify({
          step: "EVALUATE",
          content: evaluation,
        }),
      });
      continue;
    }
    if (parsedContent.step === "OUTPUT") {
      console.log(`✅`, parsedContent.content);
      break;
    }
  }
  console.log();
};
main();

