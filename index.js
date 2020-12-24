const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const jwt = require('jsonwebtoken');
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    "message": "connected"
  })
})

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(username !== "meshub" || password !== 'mesh1234'){
    res.status(401).json({
      code: 401,
      message: "Login failed"
    });
  }
  const user = { username, password };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET); 
  res.json({accessToken});
})

io.use(function(socket, next){
  if (socket.handshake.query && socket.handshake.query.token){
    jwt.verify(socket.handshake.query.token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
      if (err) return next(new Error('Authentication error'));
      console.log(decoded);
      socket.decoded = decoded;
      next();
    });
  }
  else {
    next(new Error('Authentication error'));
  }    
})
.on('connection', function(socket) {
    // Connection now authenticated to receive further events
    socket.on('message', function(message) {
        io.emit('message', message);
    });
});

server.listen(3000, () => console.log("Listening on port 3000"));