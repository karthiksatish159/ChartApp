const socket=io('ws://localhost:3000');

socket.on('connect',function()
{
    console.log(`Connected`);
})
socket.on('getRooms',function(values)
{
    if(values.length>0)
    {
     
        $('#public').html('');
        for(let i of values)
        {

            let li=$(`<li></li>`);
            li.text(i)
            li.append(`<br/><a class="button12" href="./client.html?room=${i}">join in room</a>`)
            $('#public').append(li);
        }

       
    }
    else
    {
            $('h1').text('No rooms you can create');
     }
})