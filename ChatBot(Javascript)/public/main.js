// user authenctication
const username = prompt('Enter your username');
if(!username){
     alert('username is required!');
     location.reload()

}
// socket connection
if(!window.socket|| !window.socket.connected){
     window.socket = io();
     console.log("socket connection established");
}

//  listeners for socket connection
    window.socket.on('connect',()=>{
     console.log("Socket connected",window.socket.id);    
});
    window.socket.on('disconnect',()=>{
     console.log("Socket disconnected",window.socket.id);    
});

// getting the elements
const messageInput = document.querySelector('.msg_input');
const sendBtn = document.querySelector('.send_btn');
const chatBox = document.querySelector('.chat_box');
const typingIndicator = document.querySelector('.typ_indicator');

// function to add a msg to text box

const addMsg = (msg)=>{
    const msgElement = document.createElement('div');

    if(msg.startsWith('Bot:')){
     msgElement.classList.add('bot-msg');

    }else {
     msgElement.classList.add('user-msg');
    }

    msgElement.textContent = msg;
    chatBox.appendChild(msgElement);
    chatBox.scrollTop = chatBox.scrollHeight;


};

// listnere for the send button
sendBtn.addEventListener('click',()=>{
     const msg = messageInput.value.trim();
     console.log("sending message:",msg);
           if(msg){
        socket.emit('chatMsg',msg);

        // clearing the input field
        messageInput.value='';

      }

});

//listen for chat msg event form the server
socket.on('chatMsg',(msg)=>{
     console.log("Message recived:",msg)
     addMsg(msg);

});



// display the typing msg when recived form the server
socket.on('typing',(msg)=>{
     typingIndicator.textContent =`${msg} is typing...`;
});


