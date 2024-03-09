
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import moment from "moment-timezone"
import { Room } from "./models/Room";
moment.tz.setDefault('Europe/Stockholm');
  moment.locale('sv');

let roomList: Room[] = [
  {
    id: '2024-03-07 15:12:04',
    roomName: 'main',
users:['loppan_123', 'grodanboll', 'pelle_kanin' ],

    messages: [{
      message: 'hej alla!',
      cratedAt: '2024-03-05 12:14:04',
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
        cratedAt: '2024-03-07 15:12:04',
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
      cratedAt: '2024-03-07 15:15:00',
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
  console.log("a user connected");

/* När användaren valt använtaren och kommer in på sidan så ges alla meddelanden som finns i main-room */
  socket.emit(
    "mainRoom",
    roomList.map((item) => {
        if (item.roomName === 'main'){
           return {id: item.id, roomName: item.roomName, messages:item.messages}
        }   

    })
    
    );


/* användare får all rum som den till hör skickat till sig */
socket.on("allroomsForUser",(localStorageUser, usernames, callback) => {
let getvalid = false;
console.log('hello')
  let roomUserList:Room[] =[]
roomList.forEach(room =>{

  /* Lägger till användaren i main om användaren inte redan finns */
  roomList.map((item) => {
    /* kollar i main, där alla användare loggas */
if (item.roomName === 'main'){
let array = item.users.filter((user) => user === usernames)
console.log(localStorageUser)
/* om ianvändarnamnet saknas kommer arrayens längd vara 0 */
       if(array.length <= 0){
        item.users.push(usernames)
        
/* soterar ut vilka rum användaren är med i */
        const getroom = room.users.find((item) => item === usernames)
        if(getroom){
         roomUserList.push({...room});
        }


       } 

/* om användaren har valt ett tidigare username - från localstorage */
       if(localStorageUser){
        /* soterar ut vilka rum användaren är med i */
        const getroom = room.users.find((item) => item === localStorageUser)
        if(getroom){
         roomUserList.push({...room});
        
        } }






    }   

})
 
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
    console.log("Leaving room: ", room);
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
