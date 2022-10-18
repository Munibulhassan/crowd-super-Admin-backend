
var isPlayer = 0;

var game = null,
    socket = io("http://localhost:4006");
socket.on("connection", () => {
    console.log("connected")
})

let userInput = document.getElementById("user");
let nameInput = document.getElementById("playerName");
let submitButton = document.getElementById("register")


submitButton.addEventListener("click", () => {
    let user = userInput.value;
    let playerName = nameInput.value;

    socket.emit("register", { user, playerName }, (data) => {
        
        userInput.value = "";
        nameInput.value = "";
        window.location.href = "/gameSelete";
    });

});