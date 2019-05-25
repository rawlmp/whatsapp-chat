const socket = io();
const d = document;
const deviceTime = document.querySelector(".status-bar .time");
const messageTime = document.querySelectorAll(".message .time");

deviceTime.innerHTML = moment().format("LT");

setInterval(function() {
  deviceTime.innerHTML = moment().format("LT");
}, 1000);

socket.on("message", addMessages);
socket.on("user", updateUsers);
socket.on("exit", updateUsers);

d.querySelector("#send").onclick = () => {
  sendMessage({
    name: d.querySelector("#name").value || "Guest",
    message: d.querySelector("#message").value,
    time: moment().format("LT")
  });
};

d.querySelector("#message").addEventListener("keyup", e => {
  if (e.keyCode === 13 && d.querySelector("#message").value.trim().length > 0) {
    sendMessage({
      name: d.querySelector("#name").value || "Guest",
      message: d.querySelector("#message").value,
      time: moment().format("LT")
    });
  }
});

d.querySelector("#enter").addEventListener("click", () => {
  d.querySelector(".user").style.display = "none";
  d.querySelector(".noUser").style.display = "";
  d.querySelector(".noUser2").style.display = "";
  getMessages();
});

function updateUsers(num) {
  d.querySelector(".status").innerHTML = num + " miembros online";
}

function addMessages(message) {
  if (message.name == d.querySelector("#name").value) {
    d.querySelector("#messages").insertAdjacentHTML(
      "beforeend",
      `
    <div class="message sent">
      ${message.message}
      <span class="metadata">
        <span class="time">${message.time}</span>
        <span class="tick">
          <i class="zmdi zmdi-check-all"></i>
        </span>
      </span>
    </div>
    `
    );
  } else {
    d.querySelector("#messages").insertAdjacentHTML(
      "beforeend",
      `
      <div class="message received">
        <p class="nombre">${message.name}</p>
        <span>${message.message}</span>
        <span class="metadata">
        <span class="time">${message.time}</span>
        <span class="tick">
          <i class="zmdi zmdi-check-all"></i>
        </span>
      </span>
      </div>
    `
    );
  }
  d.querySelector("#messages").scrollTop = d.querySelector(
    "#messages"
  ).scrollHeight;
}

async function getMessages() {
  let response = await fetch("http://localhost:3000/messages");
  let data = await response.json();
  data.forEach(addMessages);
}

function sendMessage(message) {
  fetch("http://localhost:3000/messages", {
    method: "POST",
    body: JSON.stringify(message),
    headers: {
      "Content-Type": "application/json"
    }
  });
  d.querySelector("#message").value = "";
}
