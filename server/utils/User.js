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
    getRoomsList()
    {
        let rooms=new Set();
        let rooms_list=[];
        for(let [key,value] of this.user)
        {
            rooms.add(value.room);
        }
        for(let i of rooms)
        {
            rooms_list.push(i);
        }
        return rooms_list;
    }

}
module.exports={Users};