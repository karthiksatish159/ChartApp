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
    socket.on('disconnect',()=>
    {
        console.log(`User was disconnected ${socket.id}`);
    })
})
app.use(express.static(publicPath));

