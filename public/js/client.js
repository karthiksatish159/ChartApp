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
// socket.on('newEmail',function(res)
// {
//     const paragraph=$('<p></p>');
//     paragraph.text(`There is your email ${res.email}`)
//     $('#KS').append(paragraph);
// })
$("#message-form").on('submit',function(e)
{
    e.preventDefault();
    let messageTextBox=$('[name=message]');
    socket.emit('createMessage',{msg:messageTextBox.val()},function(value)
    {
        if(value.error)
        {
            const li=$('<li style="color:red"></li>');
            li.text(`${JSON.stringify(value)}`);
            $('#messages').append(li)
        }
        else
        {
            messageTextBox.val('');
        }
    });
})
let locationButton=$('#send-location');
locationButton.on('click',function()
{
    if(!navigator.geolocation)
    {
        return alert('Gelocation is not supported by your browser');
    }
    locationButton.attr('disabled','disabled').text('sending location ....');

    navigator.geolocation.getCurrentPosition(function(data)
    {
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocation',{lat:data.coords.latitude,lng:data.coords.longitude});
    },
  function(){ 
    locationButton.removeAttr('disabled');
    return alert(`Unable to fetch information`)})
})
socket.on('newMessage',function(value)
{
    const li=$('<li></li>');
    console.log(value);
    li.text(`${value.message.from} : ${value.message.text}`)
    $('#messages').append(li);
})
socket.on('newLocationMessage',function(value)
{
    const li=$(`<li>from:${value.from} <a target='blank' href=${JSON.stringify(value.url)}>click me</a> createdAt:${value.createdAt}</li>`);
    $('#messages').append(li);
})
socket.on('user_removed',function(message)
{
    const li=$('<li style="color:green"></li>');
    li.text(message);
    $('#messages').append(li);
})

