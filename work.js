const chatContainer = document.querySelector(".chat-container");
const promptForm = document.querySelector(".prompt-form");
const promptInput = promptForm.querySelector(".prompt-input");
const inputBox = document.querySelector(".prompt-input");


// API_SETUP
const API_key ="AIzaSyCkukVZzZRFl2EHSTvmRSnt9YETPGsWSK4";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?
 key=${API_key}`;

let userMessage = "";
const chatHistory = [];

// function to create message element
const createMsgElement = (content, className) => {
    const div = document.createElement("div");
    div.classList.add("message", className);
    div.innerHTML = content;
    return div;
}
// make API call and genrate the bot's responese
const generateResponse = async () =>{
    // add user messsage in the chat history
  chatHistory.push({
     role: "user",
     parts: [{ text: userMessage }]
  });

  const userInput = inputBox.value;
fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyCkukVZzZRFl2EHSTvmRSnt9YETPGsWSK4", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    contents: [
      {
        parts: [{ text: userInput }]
      }
    ]
  })
})
.then(response => response.json())
.then(data => {
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";

  // Split into meaningful points — lines, numbers, or bullets
  const lines = rawText
    .split(/\n|•|▪|–|-/) // handles newline + bullet styles
    .map(line => line.trim())
    .filter(line => line.length > 0);

  // Create styled container
  const chatContainer = document.querySelector(".chat-container");
  const aiMessage = document.createElement("div");
  aiMessage.className = "ai-message";

  const title = document.createElement("h3");
  title.textContent = "✨ Kai.ai Suggestions:";
  aiMessage.appendChild(title);

  const ul = document.createElement("ul");
  lines.forEach((line, i) => {
    const li = document.createElement("li");
    li.textContent = `• ${line}`;
    ul.appendChild(li);
  });

  aiMessage.appendChild(ul);
  chatContainer.appendChild(aiMessage);
})


    
}

// hendle with submission
const handleFormSubmit = (e) => {
    e.preventDefault();
    userMessage = promptInput.value.trim();
    if(!userMessage) return;

    // generate user message HTML and add in the chat container
    const userMsgHTML = `<p class="message-text"></p>`;
    const userMsgDiv = createMsgElement(userMsgHTML, "user-message");

    userMsgDiv.querySelector(".message-text").textContent = userMessage;
    chatContainer.appendChild(userMsgDiv);

    setTimeout(() =>{
// generate bot message HTML and add in the chat container after 600ms
    const botMsgHTML = `<img src="logo.jpg" class="avatar"></i><p class="message-text">just a sec...</p>`;
    const botMsgDiv = createMsgElement(botMsgHTML, "bot-message");
    chatContainer.appendChild(botMsgDiv);
    generateResponse();
    }, 600);

    
}

promptForm.addEventListener("submit", handleFormSubmit);