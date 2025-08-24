//Zero Shot Prompting 
import 'dotenv/config'
import {OpenAI} from 'openai'
const client =new OpenAI();
async function main() {
    //These api calls are stateless (That means it doesnot remember anything) if one message is wrtten
    //for fixing it we have to write multiple contexts for both user and assitant(in other words we need to write multipe messages)

    const response=await client.chat.completions.create({
        model:"gpt-4.1-nano",
        messages:[
            {"role":"user","content":"My name is Arpan"},
            {"role":"assistant","content":"Oh hello Arpan.How can i help you?"},
            {"role":"user","content":"Whats my name?"},
            {"role":"assistant","content":"Your name is Arpan, how can i help you?"},
            {"role":"user","content":"Write a poem on my name in 2 lines"}/* output Arpan’s name, a gentle light so bright,  
Guiding hearts with warmth and pure delight. */
            /*You may ask here i am using so many tokens so the cost should be more right? but here is the catch. 
            almost all tokens except the last one had been count as  cathced token its coth is 10 times cheaper then a normal token*/
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