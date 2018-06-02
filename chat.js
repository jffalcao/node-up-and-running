var net = require('net');

var chatServer = net.createServer();
var clientList = [];

chatServer.on('connection', (client) => {
  var ip = client.remoteAddress;

  if (ip.substr(0,7) == "::ffff:") {
    ip = ip.substr(7);
  };

  client.name = ip + ':' + client.remotePort;
  client.write('Hi ' + client.name + '\n');
  console.log(client.name + ' just joined');
  
  client.write('Connexion to chat server established!\n');

  clientList.push(client);

  client.on('data', (data) => {
      broadcast(data, client);
  });

  client.on('end', () => {
    console.log(client.name + ' quit.');    
    clientList.splice(clientList.indexOf(client), 1)
  });

  client.on('error', (e) => {
    console.log(e);  
  });

});



function broadcast(message, client) {
  var cleanup = [];
  for (let i = 0; i < clientList.length; i++) {
    if (client !== clientList[i]) {
      if (clientList[i].writable) {
        clientList[i].write(client.name + " says > " + message)
      } else {
        cleanup.push(clientList[i]);
        clientList[i].destroy();
      }
    };
  };
  for (let i = 0; i < cleanup.length; i++) {
    clientList.splice(clientList.indexOf(cleanup[i]),1);    
  };
};

chatServer.listen(9000);
console.log('Chat Server started at 127.0.0.1:9000');
