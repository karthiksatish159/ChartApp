const {genrateMessage,genrateLocationMessage}=require('./message');
describe('Yeah passed the test cases for genrateMessage',()=>
{
    
    let from="karthik";
    let text='some msg';
    let message=genrateMessage(from,text);
    test('createdAt is passed',()=>
    {
        expect((typeof message.createdAt)==='number').toBe(true);
    })
    test('Message should not null',()=>
    {
        expect(message!==null).toBe(true);
    })

})
describe('Yeah passed the test cases for genrateLocationMessage',()=>
{
    let from="karthik";
    let coords={lat:7.023,lng:23.0221}
    let result=genrateLocationMessage(from,coords);
    test('url generated',()=>
    {
        expect(result.url.startsWith('https://www.google.com/maps?q=')).toBe(true)
    })
    test('data is defined coorectly',()=>{
        expect(!result.from||!result.url||!result.createdAt).toBe(false)
    })
})