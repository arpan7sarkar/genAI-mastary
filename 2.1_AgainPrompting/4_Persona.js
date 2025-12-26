import "dotenv/config"
import { OpenAI } from "openai"

const client= new OpenAI();

const main =async ()=>{
    
    const responce = await client.chat.completions.create({
        model:"gpt-5-nano",
        messages:[{role:"system",content:process.env.SYSTEM_PROMPT_Arpan},{role:"user",content:"I am feeling lazy what should i do?"}]

    })
    console.log(responce.choices[0].message.content);
    
}

main();