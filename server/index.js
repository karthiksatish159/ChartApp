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
const {Users}=require('./utils/User');
const {Room}=require('./utils/Rooms');
const {generateOTP}=require('./utils/generateOtp')
let user=new Users();
let roomMap=new Room();
io.on('connection',(socket)=>
{
    
    console.log(`New user is connected ${socket.id}`);
    socket.on('getRooms',(value,cb)=>
    {
        cb(roomMap.getRoomsList());
    })
    socket.on('createRoom',(value,cb)=>
    {
        let otp="hw"+generateOTP();
        roomMap.setRoom(otp,value);
        cb({room_id:otp});
        socket.emit('roomsAvliable',roomMap.getRoomsList())
    })
    socket.on('isRoomExist',(value,cb)=>
    {
       cb(typeof roomMap.getRoom(value.room_id)==='undefined') 
    })
    socket.on('getRoomSize',(value,cb)=>
    {
        io.in(value).allSockets()
        .then(result=>
        {
            console.log(value)
            console.log(result)
           if(result.size>=5)
           {
            cb(true)
           }
           else
           {
                cb(false);
           }
        })
    })
    socket.on('join',(params,cb)=>
    {
        if(!isString(params.name)||!isString(params.room))
        {
           return cb('Give the name of you and room-id properly');
        }
        socket.join(params.room);
        io.in(params.room).allSockets().then(result=>{
            console.log(result.size) })
        io.emit('roomsAvliable',roomMap.getRoomsList())
        user.removeUser(socket.id);
        user.addUser(socket.id,params.name,params.room);
        io.to(params.room).emit('updateUserList',user.getUserList(params.room))
        socket.broadcast.to(params.room).emit('newMessage',{
            message:genrateMessage("admin",`${params.name} was joined`)}); //* Here we are sending the joined alert to reaming user except the user who joined by the boardcast thing so here by socket object  we getting that id of joined user by that it will know that this the user we have not to send the response.
        socket.emit('newMessage',{message:genrateMessage("admin",`Welcome ${params.name} from admin`)}) //* This message is for that specific user you have to recoginze that if i go with socket object it means it's related to that user
        cb();
        /**
         * socket.leave('room123')
         * io.emit -> io.to('room123').emit this for sending message to all users in a room of room123
         * socket.boardcast.emit -> socket.boardcast.to('room123').to 
         * socket.emit 
         */
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
            let respectedUser=user.getUser(socket.id);
            io.to(respectedUser.room).emit('newMessage',
            {
                message:genrateMessage(respectedUser.user_name,message.msg),
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
        let respectedUser=user.getUser(socket.id);
        socket.emit('newLocationMessage',genrateLocationMessage(respectedUser.user_name,coords));
    })
    socket.on('disconnect',()=>
    {
        let respectedUser=user.getUser(socket.id);
     
        if(user.removeUser(socket.id))
        {
            io.in(respectedUser.room).allSockets().then(result=>{
                console.log(result.size) })
            io.to(respectedUser.room).emit('updateUserList',user.getUserList(respectedUser.room))
            io.to(respectedUser.room).emit('newMessage', {message:genrateMessage("Admin",`${respectedUser.user_name} has left.`)});
        }
      
        console.log(`User was disconnected ${socket.id}`);
    })
})

app.use(express.static(publicPath));

