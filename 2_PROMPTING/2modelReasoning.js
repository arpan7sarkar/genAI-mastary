import "dotenv/config";
import { OpenAI } from "openai";

const client = new OpenAI();
const client2 = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

async function evaluate(param) {
  const SYSTEM_PROMPT = `
    You are an AI EVALUATOR specializing in reasoning quality assessment. Your role is to analyze the thinking process of another AI model and provide constructive feedback to guide it toward better reasoning.

    EVALUATION CRITERIA:
    1. **Logical Accuracy** - Are the reasoning steps correct?
    2. **Completeness** - Are all necessary steps included?
    3. **Clarity** - Is the reasoning clear and well-structured?
    4. **Efficiency** - Is the approach optimal or unnecessarily complex?
    5. **Error Detection** - Identify any mistakes or misconceptions

    EVALUATION SCALE:
    - EXCELLENT: Reasoning is flawless, complete, and optimal
    - GOOD: Reasoning is mostly correct with minor improvements needed
    - FAIR: Reasoning has the right direction but significant gaps or errors
    - POOR: Reasoning is fundamentally flawed or incomplete

    RESPONSE FORMAT:
    Always respond in JSON: {"step": "EVALUATE", "content": "Your detailed evaluation"}

    EXAMPLE CONVERSATION:

    USER: {"step":"THINK", "content":"I need to write JavaScript code to find prime numbers. I should use a basic loop to check divisibility."}
    
    ASSISTANT: {"step":"EVALUATE", "content":"FAIR - You're on the right track thinking about divisibility checking, but your approach could be much more efficient. Consider: 1) You only need to check divisors up to √n, not all numbers up to n. 2) After checking 2, you only need to check odd numbers. 3) Look into the 6k±1 optimization for even better performance. Also, specify what 'find prime numbers' means - checking if a number is prime, or generating a list of primes?"}

    USER: {"step":"THINK", "content":"You're right! Let me think more systematically. I'll create a function to check if a single number is prime, using the √n optimization."}
    
    ASSISTANT: {"step":"EVALUATE", "content":"GOOD - Much better approach! The √n optimization will significantly improve performance. Make sure to handle edge cases: numbers less than 2 aren't prime, 2 is the only even prime, and you can skip even numbers after checking 2. Your systematic thinking shows improvement."}

    USER: {"step":"THINK", "content":"I'll handle edge cases: if n < 2 return false, if n === 2 return true, if n is even return false. Then I'll check odd divisors from 3 to √n."}
    
    ASSISTANT: {"step":"EVALUATE", "content":"EXCELLENT - Perfect logic! Your edge case handling is complete and correct. The optimization to check only odd divisors from 3 to √n will make this very efficient. This approach will handle all scenarios properly. You're ready to implement this algorithm."}

    USER: {"step":"THINK", "content":"For finding the 'fastest' prime finder, I could also implement the Sieve of Eratosthenes if the user wants multiple primes up to a limit."}
    
    ASSISTANT: {"step":"EVALUATE", "content":"EXCELLENT - Outstanding insight! You've correctly identified that 'fastest' depends on the use case. For single prime checking, your √n method is optimal. For finding all primes up to N, the Sieve of Eratosthenes is indeed faster. Consider asking the user to clarify their specific need, or implement both approaches with clear documentation about when to use each."}

    ADVANCED FEEDBACK TECHNIQUES:
    - **Socratic Questions**: Guide the model to discover issues themselves
    - **Alternative Approaches**: Suggest different methods when appropriate  
    - **Performance Considerations**: Highlight efficiency implications
    - **Edge Cases**: Point out scenarios the model might miss
    - **Best Practices**: Suggest industry-standard approaches
    - **Incremental Improvement**: Acknowledge progress while suggesting next steps

    Remember: Your goal is to make the reasoning process stronger, not just point out errors. Build upon correct thinking and gently redirect when needed.
`;

  const message1 = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    {
      role: "user",
      content: JSON.stringify({ step: "THINK", content: param }),
    },
  ];

  try {
    const response = await client2.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: message1,
    });

    const rawContent = response.choices[0].message.content;
    let parsedContent;

    try {
      parsedContent = JSON.parse(rawContent);
    } catch (parseError) {
      console.error("Failed to parse evaluation response:", rawContent);
      return "Evaluation failed - invalid JSON response";
    }

    if (parsedContent.step === "EVALUATE") {
      return parsedContent.content;
    } else {
      return "Evaluation completed";
    }
  } catch (error) {
    console.error("Evaluation API Error:", error.message);
    console.error("Status:", error.status);
    return "Evaluation failed due to API error";
  }
}

async function main() {
  // These api calls are stateless (Chain Of Thought)
  const SYSTEM_PROMPT = `
    You are an AI assistant that follows a structured reasoning process: START, THINK, and OUTPUT format.
    You work collaboratively with an EVALUATOR who will assess your thinking quality and guide you toward better reasoning.

    Rules:
    - Strictly follow the output JSON format
    - Always follow the output in sequence that is START, THINK, and OUTPUT.
    - After every think, there is going to be an EVALUATE step that is performed manually by someone and you need to wait for it.
    - Always perform only one step at a time and wait for other step.
    - Always make sure to do multiple steps of thinking before giving out output.
    - You have the tool called evaluate available to you, you have to use it after every time you think
    CORE WORKFLOW:
      1. START: Understand and restate the user's request clearly
      2. THINK: Break down the problem step-by-step with detailed reasoning
      3. EVALUATE: Wait for quality assessment from the evaluator
      4. ITERATE: Continue thinking based on evaluator feedback
      5. OUTPUT: Provide the final, well-reasoned answer
  
      COLLABORATION WITH EVALUATOR:
      - After complex or critical THINK steps, you'll receive evaluation feedback
      - Pay close attention to evaluator suggestions (EXCELLENT/GOOD/FAIR/POOR ratings)
      - Incorporate feedback to improve your reasoning
      - Ask for clarification if evaluator feedback is unclear
      - Acknowledge when you've corrected an error or improved your approach
    Output JSON Format:
    { "step": "START | THINK | OUTPUT", "content": "string" }

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

  const messages = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    {
      role: "user",
      content: "Write a code in JS to find a prime number as fast as possible",
    },
  ];

  while (true) {
    try {
      const response = await client.chat.completions.create({
        model: "gpt-5-nano",
        messages: messages,
      });

      const rawContent = response.choices[0].message.content;
      let parsedContent;

      try {
        parsedContent = JSON.parse(rawContent);
      } catch (parseError) {
        console.error("Failed to parse OpenAI response:", rawContent);
        break;
      }

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

        // Get evaluation from Gemini
        const evaluationResult = await evaluate(parsedContent.content);
        console.log(`🌪️`, evaluationResult);

        // Add evaluation to conversation history
        messages.push({
          role: "user",
          content: JSON.stringify({
            step: "EVALUATE",
            content: evaluationResult,
          }),
        });

        continue;
      }

      if (parsedContent.step === "OUTPUT") {
        console.log(`🤖`, parsedContent.content);
        break;
      }
    } catch (error) {
      console.error("Main API Error:", error.message);
      console.error("Status:", error.status);
      if (error.status) {
        console.error("Request data:", JSON.stringify(messages, null, 2));
      }
      break;
    }
  }

  console.log("Done...");
}

main().catch(console.error);
