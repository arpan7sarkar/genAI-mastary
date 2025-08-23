/* Almost everything will be same just one difference will be here we will use free gemini api key */

import 'dotenv/config'
import {OpenAI} from 'openai'
//here will be a change for gemini
const client =new OpenAI({
    apiKey:process.env.GEMINI_API_KEY,
    baseURL:'https://generativelanguage.googleapis.com/v1beta/openai/'
});
async function main() {
    const response=await client.chat.completions.create({
        model:"gemini-2.5-flash",
        messages:[
            {"role":"user","content":"My name is Arpan"},
            {"role":"assistant","content":"Oh hello Arpan.How can i help you?"},
            {"role":"user","content":"Whats my name?"},
            {"role":"assistant","content":"Your name is Arpan, how can i help you?"},
            {"role":"user","content":"Why people have affiction about 69?"}
        ]
    })
    console.log(response.choices[0].message.content);
}
main();