
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import moment from "moment-timezone"
import { Room } from "./models/Room";
// import { data } from "jquery";
import { Message } from "./models/Message";
moment.tz.setDefault('Europe/Stockholm');
  moment.locale('sv');

let roomList: Room[] = [
  {
    id: '2024-03-07 15:12:14',
    roomName: 'main',
users:['loppan_123', 'grodanboll', 'pelle_kanin' ],

    messages: [{
      message: 'hej alla!',
      cratedAt: '2024-03-05 12:14:07',
      room: 'main', 
      user:{username:'loppan_123', image:''}
    },
    {
      message: 'hej loppan!',
      cratedAt: '2024-03-05 15:12:04',
      room: 'main', 
   user:{ username:'grodanboll', image:''}
    }]
  },

  {
    id: '2024-03-07 15:12:05',
    roomName: 'room 1',
    users:['loppan_123', 'grodanboll', 'pelle_kanin'],

    messages: [
      {
        message: 'hej hej',
        cratedAt: '2024-03-07 15:12:06',
        room: 'room 1', 
     user:{username:'loppan_123', image:''}
      },
      
      
      {
      message: 'hej loppan!',
      cratedAt: '2024-03-07 15:15:00',
      room: 'room 1', 
   user:{username: 'pelle_kanin', image:''}
    },
  
    {
      message: 'hej alla!',
      cratedAt: '2024-03-07 15:15:10',
      room: 'room 1', 
   user:{username: 'grodanboll', image:''}
    }
  
  ]
  }
];


const PORT = 3000;
const app = express();

app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World");
});

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
io.on("connection", (socket) => {  

/* När användaren valt använtaren och kommer in på sidan så ges alla meddelanden som finns i main-room */
  socket.emit(
    "mainRoom",
    roomList.map((item) => {
        if (item.roomName === 'main'){
           return {id: item.id, roomName: item.roomName, messages:item.messages}
        }   
     
    
      

    }));

/* skapa ett rum om ett rum inte redan finns genom att kontrollera om username och searchUserForRoom inkluderas tillsammans vilket i rummets namn */
 
socket?.on("create_room",(username, searchUserForRoom,  callback) => {
     
  let roomExist =  roomList.find(item => item.roomName.includes(username) && item.roomName.includes(searchUserForRoom))

  const userExist = roomList.find(item => item.users.includes(searchUserForRoom))
if(!roomExist && userExist){



roomList.push({


id: moment().format("YYYY-MM-DD HH-MM-ss"),
roomName: `${username} ${searchUserForRoom}`,
users:[username, searchUserForRoom ],
messages: []

})




callback(roomList)


}


  })


    
    socket?.on("send_message",(createNewMessage:Message) => { 
  

      let newMessage = roomList.find((room) => room.roomName === createNewMessage.room);
    if (newMessage) {
   
  
      newMessage.messages.push(createNewMessage);
      


     
      io.to(newMessage.roomName).emit(
          "bid_accepted",
          newMessage
      );
  } else {
      console.log("no room found");
  }

   
 
    })



/* användare får all rum som den till hör skickat till sig */
socket.on("allroomsForUser",(localStorageUser, usernames, callback) => {
let getvalid = false;
  let roomUserList:Room[] =[]


/* lägger till användaren i main eller om användaren lämnar */
socket.rooms.forEach((room) => {
  socket.leave(room);
});

socket.join('main');
/* add new user to room */
const newUser  = roomList.map((list)  => { 
  if(list.roomName === 'main' && !list.users.includes(localStorageUser)){
  list.users.push(localStorageUser)
   } })

roomList.forEach(room =>{

  /* Lägger till användaren i main om användaren inte redan finns */
  roomList.map((item) => {
    /* kollar i main, där alla användare loggas */
if (item.roomName === 'main'){
let array = item.users.filter((user) => user === usernames)

/* om användarnamnet saknas kommer arrayens längd vara 0 */
       if(array.length <= 0 || localStorageUser){
        if(array.length <= 0){
        item.users.push(usernames)
 localStorageUser = usernames     
      }
      
/* ser villka rum användaren är med i */
        const getroom = room.users.find((item) => item === localStorageUser)
        if(getroom){
         roomUserList.push({...room});
        }} } })
 
 })


if(roomUserList.length !== 0){

  callback(true, roomUserList); 
}else{
callback(false)
}
 
})   

/* Användare ansluter till rum */
socket.on("join_room", (roomName: string, username:string, callback) => {

  socket.rooms.forEach((room) => {
  
    socket.leave(room);
  });

  socket.join(roomName);
/* add new user to room */
  const newUser  = roomList.map((list)  => { 
    if(list.roomName === roomName && !list.users.includes(username)){
    list.users.push(username)
     } })

  callback(roomList.find((rooms) => rooms.roomName === roomName))
});
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
