var net = require('net');

var chatServer = net.createServer();
var clientList = [];

chatServer.on('connection', (client) => {
  var ip = client.remoteAddress;
  var port = client.remotePort;
  
  if (ip.substr(0,7) == "::ffff:") {
    ip = ip.substr(7);
  };

  client.name = ip + ':' + port;
 
  console.log(client.name);
 
  client.write('Connexion to chat server established!\n');

  clientList.push(client);

   client.on('data', (data) => {
      broadcast(data, client);
  });
});

function broadcast(message, client) {
  for (let i = 0; i < clientList.length; i++) {
    if (client !== clientList[i]) {
      clientList[i].write(client.name + " says > " + message)
    };
  };
};

chatServer.listen(9000);