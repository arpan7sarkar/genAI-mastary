import "dotenv/config";
import { OpenAI } from "openai";
import axios from "axios";
import { log } from "console";
const client = new OpenAI();

async function getWeatherDetailsByCity(city = "") {
  const url = `https://wttr.in/${city.toLowerCase()}?format=%C+%t`;
  const { data } = await axios.get(url, { responseType: "text" });
  return `The weather in ${city} is ${data}.`;
}
async function getDetailsViaGithubUsername(username = "") {
  const url = `https://api.github.com/users/${username}`;
  const { data } = await axios.get(url);
  return JSON.stringify({
    login: data.login,
    name: data.name,
    location: data.location,
    twitter_username: data.username,
    public_repos: data.public_repos,
    followers: data.followers,
    following: data.following
  }, null, 5);
}


// getWeatherDetailsByCity("Kolkata").then(console.log);
const TOOL_MAP = {
  getWeatherDetailsByCity: getWeatherDetailsByCity,
  getDetailsViaGithubUsername: getDetailsViaGithubUsername,
};

async function main(ask = "") {
  const SYSTEM_PROMPT = `
    You are an AI assistant who works on START, THINK and OUTPUT format.
    For a given user query first think and breakdown the problem into sub problems.
    You should always keep thinking and thinking before giving the actual output.
    Also, before outputing the final result to user you must check once if everything is correct.
    You also have few tools that you can use as per user query.
    For tool call that you make wait for the OBSERVATION from the tool which is the responce from the tool that you called.
    
    Available tools:
        -getWeatherDetailsByCity(city:string): Returns the current weather data of the city
        -getDetailsViaGithubUsername(city:string): Returns the user details of the github user via username 

    Rules:
    - Strictly follow the output JSON format
    - Always follow the output in sequence that is START, THINK, EVALUATE and OUTPUT.
    - Always perform only one step at a time and wait for other step.
    - Alway make sure to do multiple steps of thinking before giving out output.
    - For every tool call wait for the OBSERVE which contain the output from the tool    

    Output JSON Format:
    { "step": "START | THINK  | OUTPUT | OBSERVE | TOOL", "content": "string", "input" : "string", "toolName" : "string" }

    Example:
    1. User: Hey can you tell me the weather of Kolkata
    ASSISTANT: { "step": "START", "content": "The user is interested on knowing the current weather of Kolkata" } 
    ASSISTANT: { "step": "THINK", "content": "Let me see if there are any tool avialable for this query   " } 
    ASSISTANT: { "step": "THINK", "content": "I see there is a tool avilable getWeatherDetailsByCity for this query" } 
    ASSISTANT: { "step": "THINK", "content": "I need to call for city Kolkata for get weather details" }
    ASSISTANT: { "step": "TOOL", "input":"kolkata","toolName":"getWeatherDetailsByCity" } 
    DEVELOPER: { "step": "OBSERVE", "content": "The weather of Kolkata is 22°C and Hazy" } 
    ASSISTANT: {"step":"THINK","content":"Great I got the weather details of Kolkata"}
    ASSISTANT: { "step": "OUTPUT", "content": "So the weather in Kolkata is 22°C and Hazy , so this is a great time to tour through the place" } 


   2.  User: Can you solve 3 + 4 * 10 - 4 * 3
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

  const messages = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    {
      role: "user",
      content: ask,
    },
  ];

  while (true) {
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
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
      console.log(`\t🧠`, parsedContent.content);

      continue;
    }
    if (parsedContent.step === "TOOL") {
      const toolToCall = parsedContent.toolName;
      if (!TOOL_MAP[toolToCall]) {
        messages.push({
          role: "developer",
          content: `There is no such tool avilable as ${toolToCall}`,
        });
        continue;
      }

      const responceFromTool = await TOOL_MAP[toolToCall](parsedContent.input);

      console.log(
        `🛠️:${toolToCall}(${parsedContent.input})= ${responceFromTool}`
      );

      messages.push({
        role: "developer",
        content: JSON.stringify({ step: "observe", content: responceFromTool }),
      });
      continue;
    }

    if (parsedContent.step === "OUTPUT") {
      console.log(`🤖`, parsedContent.content);
      break;
    }
  }

  console.log("Done...");
}

main("Tell me about this guy arpan his github username is arpan7sarkar");
