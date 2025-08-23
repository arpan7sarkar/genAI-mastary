import 'dotenv/config'
import {OpenAI} from 'openai'
const client =new OpenAI();
async function main() {
    const response=await client.chat.completions.create({
        model:"gpt-4.1-nano",
        messages:[
            {"role":"user","content":"Hey how are you?"}
        ]
    })
    console.log(response.choices[0].message.content);
    /*
    First message using OpenAI API key is done
    inp:Hey how are you?
    output:Hello! I'm doing well, thank you. How can I assist you today?
    */
}
main();