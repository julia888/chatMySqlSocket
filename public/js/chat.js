const btnLogout = document.getElementById('btnLogout');
const chatBlock = document.getElementById('chatBlock');
const inputMessage = document.getElementById('inputMessage');
const btnSend = document.getElementById('btnSend');
const ownName = document.getElementById('ownName');
const onlineUsers = document.getElementById('onlineUsers');
const container = document.querySelector('.container');
const nameUser = localStorage.getItem('user');

window.onload = ()=>{
    if (nameUser){
        ownName.innerHTML = nameUser;
    }else {
        container.innerHTML='no access to this page';
    }
};

const socket = new WebSocket("ws://localhost:8089");

btnSend.addEventListener('click', () => {
    const inputMessageValue = inputMessage.value;
    let fullMessage = {
        nameUser,
        inputMessageValue
    };
    socket.send(JSON.stringify(fullMessage));
    inputMessage.value = '';
});

socket.onmessage = function(event) {
    const incomingMessage = event.data;
    // showMessage(incomingMessage);
    showMessage(JSON.parse(incomingMessage).full);
    showOnline(JSON.parse(incomingMessage).userArray);
    console.log( typeof  JSON.parse(incomingMessage).full);
};

btnLogout.addEventListener('click', ()=>{
    localStorage.removeItem('user');
    socket.send(JSON.stringify({nameUser: nameUser, inputMessageValue :' has disconnect'}));
    window.location.replace('./')
});

function showMessage(message) {
    let messageElem = document.createElement('div');
    messageElem.appendChild(document.createTextNode(message));
    chatBlock.appendChild(messageElem);
}

function showOnline(userList) {
    onlineUsers.innerHTML = '';
    for (let i = 0; i < userList.length; i ++){
        console.log(userList[i]);
        let usersElem = document.createElement('div');
            usersElem.appendChild(document.createTextNode(userList[i]));
            onlineUsers.appendChild(usersElem);
    }
}
