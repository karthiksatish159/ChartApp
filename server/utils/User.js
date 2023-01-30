class Users
{
    constructor()
    {
       this.user=new Map();
    }
    addUser(socketid,name,room)
    {
        this.user.set(socketid,{user_name:name,room:room})
    }
    getUser(id)
    {
        return this.user.get(id)
    }
    getUserList(room)
    {
        let users_list=[];
        for(let [key,value] of this.user)
        {
            if(value.room==room)
            {
                users_list.push(value.user_name);
            }
        }
        return users_list;
    }
    removeUser(id)
    {
       return this.user.delete(id);
    }
    isAliveRooms()
    {
        let rooms_list=new Set();
        for(let [key,value] of this.user)
        {
            rooms_list.add(value.room);
        }
  let rooms=[];
  for(let i of rooms_list)
  {
    rooms.push(i);
  }
        return rooms;
    }

}
module.exports={Users};