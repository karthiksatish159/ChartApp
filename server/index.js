const path=require('path');
const publicPath=path.join(__dirname+"/../public");
const express=require('express');
const port=process.env.PORT||3000;
const socketIO=require('socket.io');
const app=express();
const server=app.listen(port,()=>{console.log(`Server is running on ${port}`)})
const io=socketIO(server);
const {genrateMessage,genrateLocationMessage}=require('./utils/message')
const {isString}=require('./utils/validator');
io.on('connection',(socket)=>
{
    
    console.log(`New user is connected ${socket.id}`);
    socket.on('join',(params,cb)=>
    {
        if(!isString(params.name)||!isString(params.room))
        {
           return cb('Give the name of you and room-id properly');
        }
        socket.join(params.room);
        /**
         * socket.leave('room123')
         * io.emit -> io.to('room123').emit this for sending message to all users in a room of room123
         * socket.boardcast.emit -> socket.boardcast.to('room123').to 
         * socket.emit 
         */
        socket.broadcast.to(params.room).emit('newMessage',{
            message:genrateMessage("admin",`${params.name}@gmail.com was joined`)}); //* Here we are sending the joined alert to reaming user except the user who joined by the boardcast thing so here by socket object  we getting that id of joined user by that it will know that this the user we have not to send the response.
        socket.emit('newMessage',{message:genrateMessage("admin",`Welcome ${params.name}@gmail.com from admin`)}) //* This message is for that specific user you have to recoginze that if i go with socket object it means it's related to that user
        cb();
    })
    socket.on('createMessage',(message,cb)=>
    {
        console.log(message.msg.length)
        if(message.msg.length ===0)
        {
            cb({error:true,msg:'send the data correctly'});
            return;
        } 
        else
        {
            cb({error:false,msg:'perfect'});
            //* So here we sending the message to all the clients including the who sent msg
            io.emit('newMessage',
            {
                message:genrateMessage(socket.id+"@gmail.com",message.msg),
            })
            //* So here we sending the message to all the clients exculding the who sent msg for that we are using boardcasting
           /* socket.broadcast.emit('newMessage',
            {
                from:socket.id+"@gmail.com",
                text:msg.msg,
                createdAt:hoursIST+":"+minutesIST
            })*/
        }
    
    })
    socket.on('createLocation',(coords)=>
    {
        socket.emit('newLocationMessage',genrateLocationMessage(socket.id+"@gmail.com",coords));
    })
    socket.on('disconnect',()=>
    {
        io.emit('user_removed',`${socket.id}@gmail.com disconnected`);
        console.log(`User was disconnected ${socket.id}`);
    })
})

app.use(express.static(publicPath));

