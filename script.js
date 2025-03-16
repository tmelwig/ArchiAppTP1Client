// TP1 - 3.1
// function fact(n) {
//   if (n === 0 || n === 1) {
//       return 1;
//   }
//   return n * fact(n - 1);
// }


// function applique(f, tab) {
//     let result = [];
//     for (let i = 0; i < tab.length; i++) {
//         result.push(f(tab[i]));
//     }
//     return result;
// }


// console.log(`Factorielle de 6 : \n${fact(6)}`);

// let tab = [1, 2, 3, 4, 5, 6];
// let factTab = applique(fact, tab);
// console.log(`Factorielles de [${tab}] : \n[${factTab}]`);

// let nPlusUnTab = applique(function(n) { return (n+1); } , tab);
// console.log(`n -> n+1 de [${tab}] avec fonction non nommée : \n[${nPlusUnTab}]`);


// TP1 - 3.2 & 3.3
// msgs for TP1 - 3.2
// let msgs = [
//     { "msg" : "Hello World" },
//     { "msg" : "Blah Blah" },
//     { "msg" : "I love cats" }
// ];

// msgs for TP1 - 3.3
// let msgs = [
//     { "msg": "Hello World", "pseudo": "Tom", "date": new Date().toLocaleString() },
//     { "msg": "Blah Blah", "pseudo": "Tommy", "date": new Date().toLocaleString() },
//     { "msg": "I love cats", "pseudo": "Tomato", "date": new Date().toLocaleString() }
// ];

// Server URL
const SERVER_URL = "https://archiapptp2server.onrender.com";

// update() for TP1 - 3.2
// function update(newMsgs) {
//     const messageList = document.getElementById("messageList");

//     // Erase existing messages
//     messageList.innerHTML = "";

//     // Check if msg is empty
//     if (newMsgs.length === 0) {
//         const li = document.createElement("li");
//         li.textContent = "No recent message...";
//         messageList.appendChild(li);
//     } else {
//         // Add new messages
//         newMsgs.forEach(item => {
//             const li = document.createElement("li");
//             li.textContent = item.msg;
//             messageList.appendChild(li);
//         });
//     }
// }

// update() for TP1 - 3.3
function update(newMsgs) {
    const messageList = document.getElementById("messageList");
    messageList.innerHTML = "";

    // Check if msg is empty
    if (newMsgs.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No recent message...";
        li.classList.add("no-message");
        messageList.appendChild(li);
    } else {
        newMsgs.forEach(item => {
            const li = document.createElement("li");
            li.classList.add("message-item");

            const pseudo = document.createElement("div");
            pseudo.classList.add("pseudo");
            pseudo.textContent = item.pseudo;

            const messageText = document.createElement("div");
            messageText.classList.add("message-text");
            messageText.textContent = item.msg;

            const date = document.createElement("div");
            date.classList.add("date");
            date.textContent = item.date;

            li.appendChild(pseudo);
            li.appendChild(messageText);
            li.appendChild(date);

            messageList.appendChild(li);
        });
    }
}


// Connect function to updateButton
// TP1 - 3.2 & 3.3
// document.getElementById("updateButton").addEventListener("click", function() {
//     update(msgs);
// });

// TP2 - 3.3 (connected to the server)
document.getElementById("updateButton").addEventListener("click", function() {
    fetch(`${SERVER_URL}/msg/getAll`)
        .then(response => response.json())
        .then(data => {
            update(data.msgs);
        })
        .catch(error => console.error("Error fetching messages:", error));
});


// Toggle light or dark mode
document.getElementById("toggleTheme").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
    document.querySelector("header").classList.toggle("dark-mode");
    document.querySelector("main").classList.toggle("dark-mode");
    document.querySelectorAll("li").forEach(li => li.classList.toggle("dark-mode"));
    document.querySelectorAll("button").forEach(btn => btn.classList.toggle("dark-mode"));
});


// Warn user about pseudo size and update character count
document.getElementById('pseudo').addEventListener('input', function() {
  const maxLength = this.getAttribute('maxlength');
  const currentLength = this.value.length;

  // Update the character count
  const charCountDisplay = document.getElementById('charCount');
  charCountDisplay.textContent = `${currentLength}/${maxLength} max`;

  // Add a red border if the input is at max length
  if (currentLength === parseInt(maxLength)) {
    this.classList.add('max-length-reached');
    charCountDisplay.classList.add('max-length-reached');
  } else {
    this.classList.remove('max-length-reached');
    charCountDisplay.classList.remove('max-length-reached');
  }
});


// Add the new written message to msgs
// Before TP2 - 3.3
// document.getElementById("sendButton").addEventListener("click", function() {
//   const pseudo = document.getElementById("pseudo").value;
//   const message = document.getElementById("message").value;
//   const date = new Date().toLocaleString();

//   if (pseudo && message) {
//     const newMsg = { "msg": message, "pseudo": pseudo, "date": date };
//     msgs.push(newMsg);
//     update(msgs);
//   }
// });

// After TP2 - 3.3 (connected to the server)
document.getElementById("sendButton").addEventListener("click", function() {
  const message = document.getElementById("message").value.trim();
  const pseudo = document.getElementById("pseudo").value.trim(); // Optional

  if (!message) {
    alert("Merci d'écrire un message avant d'envoyer.");
    return;
  }

  const requestUrl = `${SERVER_URL}/msg/post/${encodeURIComponent(message)}${pseudo ? `?pseudo=${encodeURIComponent(pseudo)}` : ''}`;

  fetch(requestUrl, {
    method: "GET",
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Failed to send message.");
    }
    return response.json();
  })
  .then(() => {
    // Clear input fields
    document.getElementById("pseudo").value = "";
    document.getElementById("message").value = "";
    loadMessages(); // Refresh the messages from the server
  })
  .catch(error => console.error("Error posting message:", error));
});

// TP2 - 3.1
// fetch(`${SERVER_URL}/msg/getAll`)
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(data) {
//     const firstMessage = data.msgs[0];
//     alert(firstMessage);
//   })
//   .catch(function(error) {
//     console.error('Error:', error);
//   });

// TP2 - 3.2
// Function to fetch and display all messages
function loadMessages() {
  fetch(`${SERVER_URL}/msg/getAll`)
    .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          const messages = data.msgs;
          const messageList = document.getElementById("messageList");
          messageList.innerHTML = '';

          // Check if no messages are available
          if (messages.length === 0) {
            const li = document.createElement("li");
            li.textContent = "No recent message...";
            li.classList.add("no-message");
            messageList.appendChild(li);
          } else {
            messages.forEach(function(message) {
              const li = document.createElement("li");
              li.classList.add("message-item");
              
              const pseudo = document.createElement("div");
              pseudo.classList.add("pseudo");
              pseudo.textContent = message.pseudo;

              const messageText = document.createElement("div");
              messageText.classList.add("message-text");
              messageText.textContent = message.msg;

              const date = document.createElement("div");
              date.classList.add("date");
              date.textContent = message.date;

              li.appendChild(pseudo);
              li.appendChild(messageText);
              li.appendChild(date);

              messageList.appendChild(li);
            });
          }
        })
        .catch(function(error) {
          console.error('Error fetching messages:', error);
        });
}

// Call loadMessages when the page is loaded
document.addEventListener('DOMContentLoaded', loadMessages);
