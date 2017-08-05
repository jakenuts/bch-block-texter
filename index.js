const request = require('request-json');
const twilio = require('twilio');

var twilioSID = '<INSERT YOUR TWILIO SID>';
var twilioToken = '<INSERT YOUR TWILIO TOKEN>';
var twilioPhone = '<INSERT TWILIO PHONE (like +18005551234)>';
var phoneToText = '<INSERT PHONE TO TEXT (like +16315551234)>';

function onNewBlock(newId){
    console.log(new Date().toISOString() + " | WOOOOT NEW!!!");
    console.log("\007"); // beep

        try{
            var smsClient = twilio(twilioSID, twilioToken);

            // Send the text message.
            smsClient.messages.create({
                    to: phoneToText,
                    from: twilioPhone,
                    body: 'New Block #' + newId + '!!!'
                },function(err, message) { 
                    console.log('Sent SMS id ' + message.sid); 
                });
        }
        catch(err){
            console.log("Error sending text " + err);
        }
}

// Create the json request client
var client = request.createClient('https://api.blockchair.com/bitcoin-cash/');
var lastId = 0;

function checkBlockId(){
    client.get('blocks?s=time(desc)&u=47c3fb72-095b-4553-b8f0-5f055a85e8d3', function(err, res, body) {
  
    var newId = body.data[0].id;

    if (lastId == 0){
        console.log(new Date().toISOString() + " | Starting at block " + newId);
    } else if (lastId == newId){
        console.log(new Date().toISOString() + " | Same block " + newId);
    }
    else {
        onNewBlock(newId);
    }
   
    lastId = newId;
    setTimeout(checkBlockId, 5000);

    });
}
 
checkBlockId();
