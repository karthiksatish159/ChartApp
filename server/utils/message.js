let genrateMessage=(from,text)=>
{
    return {
        from,
        text,
        createdAt:new Date().getTime()
    };
};
let genrateLocationMessage=(from,coords)=>
{
    return{
        from,
        url:`https://www.google.com/maps?q=${coords.lat},${coords.lng}`,
        createdAt:new Date().getTime()
    }
}
module.exports={genrateMessage,genrateLocationMessage}