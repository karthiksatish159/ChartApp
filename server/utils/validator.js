let isString=(value)=>
{
    return (typeof value==='string' && value.trim().length>0);
}
module.exports={isString}