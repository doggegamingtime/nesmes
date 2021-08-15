$(function() {
    // this initializes the dialog (and uses some common options that I do)
    $("#settings").dialog({
      autoOpen : false, modal : true, show : "blind", hide : "blind"
    });
});

var socket = io();
if (getCookie("ban") != "") window.location.replace(window.location.href.replace("/?", "") + "banned.mp4");
var username = checkCookie()
socket.emit('on connected user', username);

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
var settingsbutton = document.getElementById('settingsbutton')
var usernamesetting = document.getElementById('usernamesetting');
var focused = true;

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

usernamesetting.value = getCookie("username")
usernamesetting.addEventListener('input', function(e) {
    setCookie("username", usernamesetting.value, 365);
})

$("#changeusername").click(function() {
    socket.emit('change username', { oldusername: username, newusername: usernamesetting.value })
    username = usernamesetting.value
    for (i = 1; connectedUsers.includes(newusername) === true; i++) {
        data.newusername = newusername + ` ${i}`
    }
})

ion.sound({
    sounds: [
        {name: "ping"}
    ],
    path: "sounds/",
    preload: true,
    multiplay: true,
    volume: 1
});

window.addEventListener('focus', function (event) {
    focused = true;
});

window.addEventListener('blur', function (event) {
    focused = false;
});

socket.on('banned', () => {
    setCookie("ban", "yes", Infinity);
    window.location.replace(window.location.href.replace("/?", "") + "banned.mp4");
})

socket.on('chat message', function(data) {
    var item = document.createElement('div');
    if (data.error === true) item.id = "error";
    item.innerHTML = twemoji.parse(transformYoutubeLinks(insertEmoji(linkify(data.message))));
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
    if (!focused) ion.sound.play("ping")
});

socket.on('change username', function(data) {
    $(users).empty();
    data.connectedUsers.forEach(element => {
        var user = document.createElement('li')
        user.textContent = element;
        users.appendChild(user);
    })
    var item = document.createElement('div');
    item.id = "neutral";
    item.innerText = "User " + data.oldusername + " changed their username to " + data.newusername;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
    if (!focused) ion.sound.play("ping")
})

socket.on('on connected user', function(username, connectedUsers) {
    if (username === null || username === undefined || username === "null" || username === "undefined") return
    $(users).empty();
    connectedUsers.forEach(element => {
        var user = document.createElement('li')
        user.textContent = element;
        users.appendChild(user);
    })
    var item = document.createElement('div');
    item.id = "success";
    item.textContent = username + " connected.";
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
    if (!focused) ion.sound.play("ping")
});

socket.on('disconnect', () => {
    io.emit('on disconnected user', username);
})

socket.on('on disconnected user', function(username, connectedUsers) {
    if (username === null || username === undefined || username === "null" || username === "undefined") return
    $(users).empty();
    connectedUsers.forEach(element => {
        var user = document.createElement('li')
        user.textContent = element;
        users.appendChild(user);
    })
    var item = document.createElement('div');
    item.id = "error";
    item.textContent = username + " disconnected.";
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
    if (!focused) ion.sound.play("ping")
});