var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
const webport = 3000
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

http.listen(process.env.PORT||webport, function() { //IP Server , Port
  console.log(`listening Web server on  port :${webport}`)
})

io.on('connection', function(socket) {
  console.log('User connected: ' + socket.id)

  io.sockets.emit('in',{ack:'User connected: '+socket.id})
  
  socket.on('disconnect', function(){
    console.log('User disconnected: ' + socket.id)
   io.sockets.emit('in',{ack:'User disconnected: '+socket.id}) 
  })
  
  socket.on('random',(data)=>{
     console.log(data)
     if(Object.keys(data) == "MCU1"){
      io.sockets.emit('mcudata1',{ack:data}) //Send to browser
       io.sockets.emit('backmcu',data) //Send back to MCU1
     //io.sockets.emit('backmcu',data.toString(16)) //Send back to MCU
     }

     if(Object.keys(data) == "MCU2"){
      io.sockets.emit('mcudata2',{ack:data}) //Send to browser
     }
     
  })

 socket.on('sendreq',(data)=>{
    io.sockets.emit('mcurev',data) //Send from input to MCU
 })

})