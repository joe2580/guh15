var connection = new WebSocket('ws://52.31.126.150:8080/gameManager');

var connected = 0;

var seed = -1;

while (connected = 0) {}
sendname();

var players = [];
var hoops   = [];
var scores  = [];

$(window).on('beforeunload', function(){
      connection.close();
});

connection.onopen = function() {
  console.log("Connected to server");
  connected = 1;
};


connection.onerror = function(error) {
  console.log(error);
};

connection.onclose = function() {
  console.log("Connection closed");
  alert("Lost connection to server!");
};

connection.onmessage = function(e) {
  console.log(e);
  var jobject = JSON.parse(e.data);
  switch(jobject.type) {
    case 'seed':
      seed = jobject.seed;
      break
    case 'add':
      var player = {};
      player.id   = jobject.id;
      player.name = jobject.name;
      player.xpos = 0;
      player.ypos = 0;
      player.zpos = 0;
      player.xrot = 0;
      player.yrot = 0;
      player.zrot = 0;
      player.wrot = 0;
      players[i] = player;
      break
    case 'del':
      players[i] = null;
      break
    case 'positions':
      var i = jobject.id;
      players[i].xpos = jobject.xpos;
      players[i].ypos = jobject.ypos;
      players[i].zpos = jobject.zpos;
      players[i].xrot = jobject.xrot;
      players[i].yrot = jobject.yrot;
      players[i].zrot = jobject.zrot;
      players[i].wrot = jobject.wrot;
      break
    case 'hoops':
      var hoop = {};
      hoop.xpos = jobject.xpos;
      hoop.ypos = jobject.ypos;
      hoop.zpos = jobject.zpos;
      hoop.xrot = jobject.xrot;
      hoop.yrot = jobject.yrot;
      hoop.zrot = jobject.zrot;
      hoop.wrot = jobject.wrot;
      hoops[jobject.id] = hoop;
      break
    case 'scores':
      for(var k in jobject) {
        if (k == 'scores') continue
        scores[k.id] = k.score;
      }
      break
    case 'feed':
      adds_to_feed(jobject.message);
      break 
  };
};



function sendname() {
  var name   = prompt("Please enter your name");
  connection.send(JSON.stringify({ 'type': 'name', 'name': name }));
};

var sendded = function() {
  connection.send(JSON.stringify({ 'type': 'death' }));
};

var sendpos = function(posX, posY, posZ, rotX, rotY, rotZ, rotW) {
  var jobject = {
    'type': 'position',
    'xpos': posX,
    'ypos': posY,
    'zpos': posZ,
    'xrot': rotX,
    'yrot': rotY,
    'zrot': rotZ,
    'wrot': rotW
  }
  connection.send(jobject);
};

var sendhoop = function(hoopid) {
connection.send(JSON.stringify( { 'type': 'hoop', 'hoopid':  hoopid} ));
};
