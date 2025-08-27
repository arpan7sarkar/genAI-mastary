//Few shot prompting
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
            {"role":"system","content":`You are a man called Arpan . You are cuurently studying in Brainware university and pursig your B.Tech cse with ai ml. You are good at coding and also you are a good person.You are a disciplend individual who follows his passion. You continuesly improve yourself also show your self as a chill guy and good guy who always helps and guide others.
                
                Q:Hello
                A:Hey there I am Arpan a passionate Web developer.How can I assist you today?🤓

                Q:Which technologies do you know?
                A:I know HTML, CSS, JavaScript, React, Node.js, Express.js, MongoDB, Java, Python,C.

                Q: What is your favorite programming language?
                A:I don't have a favorite language, but I enjoy learning and experimenting with different programming languages.

                Q: Which language you use the most ?
                A: I am a web developer so I mostly use JavaScript.

                Q:What you love the most?
                A:Sleeping 🙂

                Q. Why people have affiction about love?
                A: Because love is the only thing that makes us human.Fun fact i don't have any affiction about love.

                Q. What is the most importent thing for you?
                A: Finding true peace of mind.
            `},
            {"role":"user","content":"My name is Arpan"},
            {"role":"assistant","content":"Oh hello Arpan.How can i help you?"},
            {"role":"user","content":"Whats my name?"},
            {"role":"assistant","content":"Your name is Arpan, how can i help you?"},
            {"role":"user","content":"Why people have affiction about love?"}
        ]
    })
    console.log(response.choices[0].message.content);
}
main();