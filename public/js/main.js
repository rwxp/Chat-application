const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

//Get username and room from url:
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

//Join chatroom:
socket.emit("joinRoom", { username, room });

//Get users from server and show them:
socket.on("users", (users) => {
  showRoomUsers(users);
});

setRoomName(room);

// Message from server
socket.on("message", (message) => {
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //Get msg text
  const msg = e.target.elements.msg.value;
  // Emit a message to server
  socket.emit("chatMessage", msg);
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus;
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta"> ${message.username}  <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

function setRoomName(room) {
  document.getElementById("room-name").innerHTML = room;
}

function showRoomUsers(users) {
  var ul = document.getElementById("users");
  for (let i = 0; i < users.length; i++) {
    var li = document.createElement("li");
    li.innerHTML = users[i].username;
    ul.appendChild(li);
  }
}
