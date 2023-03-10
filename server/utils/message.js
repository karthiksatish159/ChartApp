const moment=require('moment');
let genrateMessage=(from,text)=>
{
    return {
        from,
        text,
        createdAt:moment().valueOf()
    };
};
let genrateLocationMessage=(from,coords)=>
{
    return{
        from,
        url:`https://www.google.com/maps?q=${coords.lat},${coords.lng}`,
        createdAt:moment().valueOf()
    }
}
module.exports={genrateMessage,genrateLocationMessage}