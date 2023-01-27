const socket=io('ws://localhost:3000')
//In clientJs you better go with normal syntax of function instead of going with the arrow function 
//Because it is Es6 thing it will work fine in chrome browser if we go with out-dated browser like internetExploer it might get crash
socket.on('connect',function()
{
    console.log('Server is connected'); 
});
socket.on('disconnect',function()
{
    console.log('Server is disconnected'); 
})
//Client asking a email
socket.emit('giveEmail');
socket.on('newEmail',function(res)
{
    const paragraph=document.createElement("p");
    const node=document.createTextNode(`There is your email ${res.email}`);
    paragraph.appendChild(node);
    const element=document.getElementById("KS");
    element.appendChild(paragraph);
    console.log(`There is your email ${res.email}`);
})
let btn=document.getElementById("btn");
console.log(btn)
btn.addEventListener('click',function(e)
{
    socket.emit('createMessage',{msg:document.getElementById('name').value});
})
socket.on('newMessage',function(value)
{
    const li=document.createElement("li");
    const Text=document.createTextNode(JSON.stringify(value));
    li.appendChild(Text);
    const ul=document.querySelector("ul");
    ul.appendChild(li);
})
