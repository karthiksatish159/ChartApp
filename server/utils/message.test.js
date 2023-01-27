const {genrateMessage}=require('./message');
describe('Yeah passed the test cases',()=>
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