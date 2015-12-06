var connection = new WebSocket('ws://52.31.126.150:8080/gameManager');
connection.binaryType = 'arraybuffer';
sendname();

$(window).on('beforeunload', function(){
      connection.close();
});

function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf); 
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

connection.onopen = function() {
  console.log("Connected to server");
};

connection.onerror = function(error) {
  console.log(error);
};

connection.onclose = function() {
  console.log("Connection closed");
};

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

connection.onmessage = function(e) {
  console.log(e);
  if (!(e.data instanceof ArrayBuffer)) { log(e.data); return }
  console.log(ab2str(e.data));
  if (e.data.byteLength == 0) return
  var dv = new DataView(e.data);
  var type = String.fromCharCode.apply(null, new Uint16Array(dv.getUint16(e.data.slice(0,2))));
  switch(type) {
    case 'M':
      log("Seed is " + dv.getFloat64(2));
      break
    case 'A':
      var name = String.fromCharCode.apply(null, new Uint16Array(e.data.slice(3)));
      log("New player id:" + dv.getUint8(2) + " Name:" + name);
      break
    case 'D':
      log("Delete player id:" + dv.getUint8(2));
      break
    case 'P':
      log("Player Positions:");
      var gf32 = dv.getFloat32;
      var posdata = e.data.splice(2);
      var players = posdata.byteLength / 29
      for(var i = 0; i <= players; i++) {
        var pos = "(" + gf32(i*29+1)  + ", " + gf32(i*29+5)  + ", " + gf32(i*29+9)  + ")";
        var rot = "(" + gf32(i*29+13) + ", " + gf32(i*29+17) + ", " + gf32(i*29+21) + ", "; 
        rot = rot + gf32(9*29+25) + ")";
        log("" + dv.getUint8(i*29) + ": " + pos + " " + rot);
      }
      break
    case 'H':
      log("Hoop Positions:");
      var gf32 = dv.getFloat32;
      var posdata = e.data.splice(2);
      var hoops = posdata.byteLength / 29
      for(var i = 0; i <= hoops; i++) {
        var pos = "(" + gf32(i*29+1)  + ", " + gf32(i*29+5)  + ", " + gf32(i*29+9)  + ")";
        var rot = "(" + gf32(i*29+13) + ", " + gf32(i*29+17) + ", " + gf32(i*29+21) + ", ";
        rot = rot + gf32(9*29+25) + ")";
        log("" + dv.getUint8(i*29) + ": " + pos + " " + rot);
      }
      break
    case 'S':
      log("Scoreboard:");
      var scoredata = e.data.splice(2);
      var players = posdata.byteLength / 5;
      for(var i = 0; i <= players; i++) {
        log("" + dv.getUint8(i*5) + ": " + dv.getUint32(i*5+1));
      }
      break
    case 'F':
      var name = String.fromCharCode.apply(null, new Uint16Array(e.data.slice(3)));
      log("Feed message:" + dv.getUint8(2) + " Name:" + name);
      break 
  }
};

function sendname() {
  var name   = "N" + prompt("Please enter your name");
  var buffer = new ArrayBuffer(name.length * 2);
  var dv     = new DataView(buffer);
  for( i = 0; i < name.length; i++)
    dv.setUint16(i*2, name.charCodeAt(i));

  connection.send(buffer);
  console.log();
}

var sendded = function() {
  var buffer = new ArrayBuffer(2);
  var dv     = new DataView(buffer);
  dv.setUint16(0, "K".charCodeAt(0));
  connection.send(buffer);
}

var sendpos = function(posX, posY, posZ, rotX, rotY, rotZ, rotW) {
  var buffer = new ArrayBuffer(30);
  var dv     = new DataView(buffer);
  dv.setUint16(0, "L".charCodeAt(0));
  dv.setFloat32(2, posX);
  dv.setFloat32(6, posY);
  dv.setFloat32(10, posZ);
  dv.setFloat32(14, rotX);
  dv.setFloat32(18, rotY);
  dv.setFloat32(22, rotZ);
  dv.setFloat32(26, rotW);
  console.log(dv);
  connection.send(buffer);
}

var sendhoop = function(hoopID) {
  var buffer = new ArrayBuffer(3);
  var dv     = new DataView(buffer);
  dv.setUint16(0, "L".charCodeAt(0));
  dv.setUint8(2, hoopID);
  connection.send(buffer);
}

