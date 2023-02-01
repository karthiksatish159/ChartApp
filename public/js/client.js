const socket=io('ws://localhost:3000')
//In clientJs you better go with normal syntax of function instead of going with the arrow function 
//Because it is Es6 thing it will work fine in chrome browser if we go with out-dated browser like internetExploer it might get crash
socket.on('connect',function()
{
    let params=$.deparam(location.search);
    if(params.name&&params.room)
    {
        socket.emit('join',params,function(err)
        {
            if(err)
            {
                alert(err);
                location.href='/';
            }
            else
            {
                console.log("Everything is fine");
            }
        })
    }

    console.log('Server is connected'); 
});
socket.on('disconnect',function()
{
    console.log('Server is disconnected'); 
})
// function scrollToBottom()
// {
//     //Selectors
//     let messages=$('.messages');
//     let newMessages=messages.childern('li:last-child');
//     //Height
//     let clientHeight=messages.prop('clientHeight');
//     let scrollTop=messages.prop('scrollTop');
//     let scrollHeight=messages.prop('scrollHeight');
//     let newMessageHeight=newMessages.innerHeight();
//     let lastMessageHeight=newMessages.prev().innerHeight();
//     if(clientHeight+scrollTop+newMessageHeight+lastMessageHeight>=scrollHeight)
//     {
//         messages.scrollTop(scrollHeight);
//     }
// }
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

    // const li=$('<li></li>');
    // li.text(`${value.message.from} ${formatedTime}  : ${value.message.text}`)
    // $('#messages').append(li);
    let formatedTime=moment(value.message.createdAt).format('LT');
    let template=$('#message-template').html();
    let html=Mustache.render(template,
        {
            text:value.message.text,
            from:value.message.from,
            createdAt:formatedTime      
        })
    $("#messages").append(html);
   
})
socket.on('newLocationMessage',function(value)
{
    // const li=$(`<li>from:${value.from} ${formatedTime}  <a target='blank' href=${JSON.stringify(value.url)}>click me</a> createdAt:${value.createdAt}</li>`);
    // $('#messages').append(li);
    let template=$("#location-message-template").html();
    let formatedTime=moment(value.createdAt).format('LT');
    let html=Mustache.render(template,
        {
            from:value.from,
            url:value.url,
            createdAt:formatedTime
        })
        $('#messages').append(html);
})
socket.on('updateUserList',(users)=>
{
    let ol=$('<ol></ol>');
    users.forEach(element => 
        {
            ol.append($('<li></li>').text(element))
        });
        $('#users').html(ol);
})
function myFunction()
{

    let params=$.deparam(location.search);
    if(params.flag==1)
    {
        let element=$(` <br> <input type="checkbox" id="roomType" name="roomType" value="Bike"> <label for="roomType"> Make private</label><br>`)
        element.insertBefore("#btn123")
        $('#btn').text('create room')
    }
}
socket.on('roomsAvliable',(data)=>
{
    let ol=$('#rooms');
    ol.html('');
    for(let i of data)
    {
        ol.append(`<li>${i}</li>`)
        ol.append(`<a class="but" href="#">join</a>`)
    }
})
socket.emit('getRooms',{},function(data)
{
    let ol=$('#rooms');
    ol.html('');
    for(let i of data)
    {
        ol.append(`<li>${i}</li>`)
        ol.append(`<a class="but" href="./rooms2.html?room-id=${i}">join</a>`)
    }
})
$('#form2').on('submit',function(e)
{
    e.preventDefault();
    let params=$.deparam(location.search);
    socket.emit('getRoomSize',params["room-id"],function(IsroomFull)
    {
            if(IsroomFull)
            {
                alert('Room is full');
                location.href='/';
            }
            else
            {
                location.href=`./chat.html?name=${$('#username').val()}&room=${params["room-id"]}`
            }
    });

})
$('#form').on('submit',function(e)
{
    e.preventDefault();
    let params=$.deparam(location.search);
    if(params.flag==1)
    {
        //Here give a emit i.e create room in server side we have to generate a room-id and create a room and send ack
        socket.emit('createRoom',$('#roomType')[0].checked,function(value)
        {
            alert("'Copy the room_id': "+value.room_id);
           location.href=`./chat.html?name=${$('#name').val()}&room=${value.room_id}`
        })
    }
   
})
$('#form3').on('submit',function(e)
{
 
    e.preventDefault();
    let room_id=$('#room_idJoin').val();


    socket.emit('isRoomExist',{room_id},function(value)
    {

        if(!value)
        {
            socket.emit('getRoomSize',room_id,function(IsroomFull)
            {
                    if(IsroomFull)
                    {
                        alert('Room is full');
                        location.href='/';
                    }
                    else
                    {
                        location.href=`./chat.html?name=${$('#nameJoin').val()}&room=${room_id}`
                    }
            });
        }
        else
        {
            location.href='/';
        }
    })

})



