
Text to text models doesnot have any live data
May ask why the dont't have?
ans:LLM= text to text model
In the basis of pretrained data and the avilable/given context the TTT model gives output . 
so we can't directly have every realtime data in the system prompt or pretrianed data,
so here comes our savior ai agents that can have realtime data, do any task on behalf of us.


Let's use an analogy to understand agents:

Think of your llm as brain he has the knowldege but for performing any task it needs to have hands or legs so agents hase these extra parts that used to perform a particuler task

EX: for getting realtime weather data we can give agents a tool that can call weather api and get the data then serve it to the user.


Now the question arises that how do we create a agent?
The answer is simple we have to create our own tools (mainly different functions) then in the SYSTEM_PROMPT we have to tell the llm that you have x tool you can use tool x when y situation occures

let breakthrough a example:
    create a functions that gets weather report as per live data/api call
    in system prompt we have to tell the llm model that you have few tools in your inventory
    if user wants to know the live weather report then you should call this function get the output and tell to the user
    then we have to write COT for it , also few examples explaining how it is going to happen.