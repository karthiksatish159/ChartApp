const path=require('path');
const publicPath=path.join(__dirname+"/../public");
const express=require('express');
const port=process.env.PORT||3000;
const socketIO=require('socket.io');
const app=express();
const server=app.listen(port,()=>{console.log(`Server is running on ${port}`)})
const io=socketIO(server);
io.on('connection',(socket)=>
{
    console.log(`New user is connected ${socket.id}`);
    socket.on('giveEmail',()=>
    {
        console.log('Ok');
        let newEmail=socket.id+"@gmail.com";
        socket.emit('newEmail',{email:newEmail});
    })
    socket.on('createMessage',(msg)=>
    {
        var currentTime = new Date();
        var currentOffset = currentTime.getTimezoneOffset();
        var ISTOffset = 330;   // IST offset UTC +5:30 
        var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
        // ISTTime now represents the time in IST coordinates
        var hoursIST = ISTTime.getHours()
        var minutesIST = ISTTime.getMinutes()
        io.emit('newMessage',
        {
            from:socket.id+"@gmail.com",
            text:msg.msg,
            createdAt:hoursIST+":"+minutesIST
        })
    })
    socket.on('disconnect',()=>
    {
        console.log(`User was disconnected ${socket.id}`);
    })
})
app.use(express.static(publicPath));

