import "dotenv/config";

import { OpenAI } from "openai";

const client = new OpenAI();

async function main() {
    //these api calls are stateless they didn't remember anything
  const response = await client.chat.completions.create({
    model: "gpt-5-nano",
    messages: [
      { role: "user", content: "Hey how are you buddy?" },
      {
        role: "assistant",
        content:
          "Hey buddy! I'm doing well, thanks for asking. How about you? What's on your mind today—need help with something, or just want to chat?",
      },
      { role: "user", content: "So my name is Arpan I am a developer." },
      {role:"assistant",content:"Nice to meet you, Arpan! What kind of development do you do? What's your main tech stack? If you want, I can help with code reviews, debugging, learning new tools, interview prep, or building a small feature end-to-end. Tell me about your current project or share a snippet you're stuck on, and we'll dive in."},
      { role: "user", content: "My current techstack is MERN, write a 4 line poem using my details" },

    ],
  });

  console.log(response.choices[0].message.content);
}

main();
