const socket = io.connect();

let script = document.createElement('script');
script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';
document.getElementsByTagName('head')[0].appendChild(script);

let script2 = document.createElement('script');
script2.src = 'https://unpkg.com/ejs@3.1.6/ejs.min.js';
document.getElementsByTagName('head')[0].appendChild(script2);

const element = document.querySelector("#element");
const myButton = document.querySelector("#myButton");
const chatButton = document.querySelector("#chatButton");
const chatForm = document.querySelector(".chatForm");
const prodForm = document.querySelector(".myForm");
const chatUser = document.querySelector(".chatUser");
const myUser = document.querySelector(".myUser");
const newCartButton = document.querySelector(".NewCart");

if (prodForm) {
    prodForm.addEventListener("submit", (event) => {
        event.preventDefault();
        return fetch(`/api/products/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"name": event.target.name.value, "price":event.target.price.value,
            "desc": event.target.desc.value, "photo": event.target.photo.value, "code": event.target.code.value,
            "stock": event.target.stock.value}),})
    })
}

const render = (data) => {
    const html = data.map(elem => {
        return (`<div style="display:flex; column-gap: 0.2rem;">
        <strong style="color:blue;">${elem.author.alias}</strong> 
        <p style="color:brown;">[${elem.time}]</p>
        <i style="color:green;">${elem.text}</i></div>`)}).join(" ");
        document.querySelector(".ChatMsgs").innerHTML = html;
}

const scrollToBottom = (node) => {
	node.scrollTop = node.scrollHeight;
}

const addMessage = () => {
    const mensaje = {
        alias: chatUser.innerHTML,
        text: document.querySelector("#text").value,
    }
    socket.emit("new-message", mensaje);
    scrollToBottom(document.querySelector(".ChatMsgs"));
    return false;
}

if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        return fetch(`/api/mensajes/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(
                {"author": 
                    {"alias": chatUser.innerHTML,}, 
                "text": e.target.text.value, 
                "time": new Date().toLocaleString()}),})
    })
    chatForm.addEventListener("submit", () => addMessage());
}

const addProducto = () => {
    const producto = {
        name: document.querySelector("#name").value,
        price: document.querySelector("#price").value,
        photo: document.querySelector("#photo").value,
    }
    socket.emit("nuevo-producto", producto);
    return false;
}

myButton && myButton.addEventListener("click", () => addProducto());

socket.on("Mensajes", data => {
    render(data);
});

socket.on("MensajeIndividual", data => {
    document.querySelector(".ChatMsgs").innerHTML+=`
    <div style="display:flex; column-gap: 0.2rem;">
        <strong style="color:blue;">${data.alias}</strong> 
        <p style="color:brown;">[${data.time}]</p>
        <i style="color:green;">${data.text}</i></div>               
`});

const getTemplate = async () => {
    const template = await fetch("/shop/template.html");
    const templateData = await template.text();
    return templateData;
}

socket.on("Productos", async data => {
    const templateData = await getTemplate();
    const template = ejs.compile(templateData);

    const templateRendered = data.map(elem => {
        return template({
            name: elem.name,
            price: elem.price,
            photo: elem.photo,
            id: elem.id,
        })
    }).join(" ");

    element ? element.innerHTML = templateRendered : null;
});

socket.on("ProductoIndividual", async data => {
    const templateData = await getTemplate();
    const template = ejs.compile(templateData);

    const templateRendered = template({
        name: data.name,
        price: data.price,
        photo: data.photo,
        id: data.id,
    })
    
    element.innerHTML += templateRendered;
})

