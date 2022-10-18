
var isPlayer = 0;

var game = null,
    socket = io("http://localhost:4006");
socket.on("connection", () => {
    console.log("connected")
})


    
// players = Object.keys(JSON.parse(players))
// let userInput = document.getElementById("playerList");
// let listTag = document.createElement("li");

// if (players.length > 0) {
//     players.forEach(user => {
//         listTag.value = user.playerName;
//         userInput.append(listTag);
//     });

// }

// let userInput = document.getElementById("user");
// let nameInput = document.getElementById("playerName");
// let submitButton = document.getElementById("register")
// console.log(submitButton)

// submitButton.addEventListener("click", () => {
//     let user = userInput.value;
//     let playerName = nameInput.value;
//     socket.emit("register", { user, playerName }, (data) => {
//         console.log(data);
//         userInput.value = "";
//         nameInput.value = "";
//     })
// });