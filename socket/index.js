
  const io = require("socket.io")(8900, {
    cors: {
      origin: "http://localhost:3000",
    },
  });
  
  let users = [];//save users
  
  const addUser = (userId, socketId) => {
    !users.some((user) => user?.userId === userId) &&
      users.push({ userId, socketId });
  };
  
  const removeUser = (socketId) => {
    users = users.filter((user) => user?.socketId !== socketId);
  };
  
  const getUser = (userId) => {
    console.log(userId);
    console.log(users);
    const data = users.find((user) => user?.userId === userId);
    console.log("data",data);
    return data;
  };
  
  io.on("connection", (socket) => {
    
    //when ceonnect
    console.log("a user connected.");
  
    //take userId and socketId from user
    socket.on("addUser", (userId) => {
      console.log(socket.id);
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });
  
    //send and get message
    socket.on("sendMessage", (data) => {
      console.log(data.receiveUserId);
      
      const user = getUser(data.receiveUserId);
      console.log(user);
      console.log(user?.socketId);
      console.log(user?.userId);
      io.to(user?.socketId).emit("getMessage", data);
    });
  
    //when disconnect
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      removeUser(socket?.id);
      io.emit("getUsers", users);
    });
  });