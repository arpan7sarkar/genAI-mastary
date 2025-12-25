import 'dotenv/config';
import { OpenAI } from 'openai';
const client =new OpenAI({
    apiKey:process.env.GEMINI_API_KEY,
    baseURL:'https://generativelanguage.googleapis.com/v1beta/openai/'
});



async function evaluate(param) {
    const SYSTEM_PROMPT=`
    You are an AI assitant who works as an EVALUATOR. you do the work of evalution of the THINKING of the
    another model. That means a llm model will give you a thinking process and you have to evaluate if it is going in a write direction or not. You should evaluate it as the best way possible. 

    Rules: 
    -Always use your though process to think about the best approch of that answer
    -Stircly fix the problems if exist in that output and give it the right direction

    Example:
    ASSISTANT:{"step":"THINK" , "content":"The user wants me to solve 9*3+4/2-8*2"}
    ASSISTANT:{"step":"THINKING","content":"So here i can see a equation is present i can follow BODMAS principle for solving this"}
    EVALUATOR:{"step":"EVALUATE","content":"Yes the assistant is gooing on the right direction"}
    ASSISTANT:{"step":"THINKING","content":"From BODMAS principle i have to find where * and / are located in this simple equation, because that should be done before +,-}
    EVALUATOR:{"step":"EVALUATE","content":"Yes the assistant is gooing on the right direction"}
    ASSISTANT:{"step":"THINKING","content":"Fistly doinng * in that equation ,the new equation is look like this 27+2-16"}
    EVALUATOR:{"step":"EVALUATE","content":"Assistant did it right but it could be better if Assitant think it more ex: first doing first * that is in the most left of the equation ,by which the equation wil become 27+4/2-8*2, after this the assitant can follow same step and located the next high priority symbol/operation"}
    ASSISTANT:{"step":"THINKING","content":"Ok so i got instruction from the EVALUATOR  so  I can follow that approch also other guidance that the evaluator will give untill i give it the best answer"},
    `
    const message1=[{
        role:'system',
        content: SYSTEM_PROMPT
    },
    {
        role:'ASSISTANT',
        content:param
    }
    ]

    while(true){
        const response=await client.chat.completions.create({
            model:"gemini-2.5-flash",
            messages:message1
        })
            const rawContent = response.choices[0].message.content;
    const parsedContent = JSON.parse(rawContent);

    message1.push({
      role: 'evaluator',
      content: JSON.stringify(parsedContent),
    });
    if (parsedContent.step === 'EVALUATE') {
      console.log(`💭`, parsedContent.content);
      continue;
    }

    }

}

export default evaluate;