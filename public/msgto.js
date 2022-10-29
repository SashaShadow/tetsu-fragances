const socket = io.connect();

let script = document.createElement('script');
script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';
document.getElementsByTagName('head')[0].appendChild(script);

let script2 = document.createElement('script');
script2.src = 'https://unpkg.com/ejs@3.1.6/ejs.min.js';
document.getElementsByTagName('head')[0].appendChild(script2);

// const msgToAdmForm = document.querySelector(".MsgToForm")
const myUser = document.querySelector(".myUser");
const msgsPlace = $(".Msgs");

$(".MsgsToView").on("submit", ".MsgToForm", (e) => {
    e.preventDefault();
    const to = $(".SelectedUser").text() ? $(".SelectedUser").text() : null;
    const newMsg = {
            "author": myUser.innerHTML, 
            "text": e.target.text.value.replace(/\s\s+/g, ' ').trim(), 
            "time": new Date().toLocaleString(),
            "to": to
    };
    return fetch(`/api/msgsto/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newMsg)
        })
        .then(_ => {
            alert('Mensaje enviado')
            window.location.replace('/shop/mp')
        })
}) 