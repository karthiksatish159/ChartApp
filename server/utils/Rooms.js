class Room
{
    constructor()
    {
        this.room=new Map();
    }
    setRoom(room_id,isPrivate)
    {
        if(!this.room.has(room_id))
        {
            this.room.set(room_id,isPrivate);
        }
    }
    getRoom(room_id)
    {
        return this.room.get(room_id);
    }
    getRoomsList()
    {
        let rooms_list=[];
        for(let [key,value] of this.room)
        {
            if(!value)
            {
                rooms_list.push(key);
            }
        }
        return rooms_list;
    }
}
module.exports={Room}