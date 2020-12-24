const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const jwt = require('jsonwebtoken');

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

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => console.log("Listening on port 3000"));