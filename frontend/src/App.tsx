import  { ChangeEvent, useEffect, useState } from "react"; 
import "./App.css";
import './sass/style.scss';
import './sass/_login.scss';
import { Socket, io } from "socket.io-client";
import moment from 'moment-timezone';
import 'moment/dist/locale/sv';
import { Room } from "./models/Room";
import { CreateMessage } from "./components/CreateMessage";
import { Message } from "./models/Message";
import AvatarPicker from "./components/AvatarPicker";
function App(){ 




  moment.tz.setDefault('Europe/Stockholm');
  moment.locale('sv');
  const [socket, setSocket] = useState<Socket>();
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room>();
  const [newMessage, setNewMessage] = useState('')
  const [username, setUsername] = useState('')
  const [image, setImage] = useState<string>("")
const [validUsername, setValidUsername] = useState<boolean>(false)
const [errorMessage, seterrorMessage] = useState('')
const [localStorageUser, setLocalStorageUser] = useState<string>( '')
const showLocalStorageUser: string| null = localStorage.getItem("user");

  useEffect(() => {
    if (socket) return;

    const s = io("http://localhost:3000");

  s.on( "bid_accepted", (product: Room) => {
   
      setSelectedRoom(product);
    });

    s.on("mainRoom", (mainRoomData: Room[]) => {
      setSelectedRoom(mainRoomData[0]);

      
    });

   

    setSocket(s);
  }, [setSocket, socket, selectedRoom]);




  const PostMessage = () => {

if(selectedRoom){
      const createNewMessage:Message= {
        message: newMessage,
        room:selectedRoom.roomName,
        cratedAt: moment().format('DD-MM-YYYY HH:mm:ss'),
        user:{ username,
          image}
          
    
     }
    
    socket?.emit("send_message", createNewMessage)
   setNewMessage('')
   
    }
     

     }

  const handleClick = (roomName: string) => {
    socket?.emit("join_room", roomName, username, (data: Room) => {
      setSelectedRoom(data);
   
    });

  };


 
const checkIfUsernameValid =  () =>{
  /* Här behöver vi skapa logik för att se om användarnamnet är unikt */
  if(username !== '' || localStorageUser !== ""){
socket?.emit("allroomsForUser", localStorageUser,  username,(valid:boolean, rooms: Room[]) => {
if(valid){
 localStorage.setItem("user", username);
  setAllRooms(rooms)
  setValidUsername(valid)
}
  else if(!valid){
seterrorMessage('Användare finns redan')
setValidUsername(valid)
setUsername('')
setImage('')
}
}) 
} else{
  seterrorMessage('Välj ett användarnamn')
  }
}
const handelLocalStorageUser = () =>{
if(showLocalStorageUser){
setUsername(showLocalStorageUser)
setLocalStorageUser(showLocalStorageUser)
}

}








  return (
    <>
    <div className="app-login">

      <div className="container-login">
{!validUsername  && <article>
  <>
  {showLocalStorageUser && <button onClick={handelLocalStorageUser} >{showLocalStorageUser}</button> }
  

  <div className="container-content">
      <h1> Välkommen till chattylachatt </h1>
      <p>Ett enkelt och roligt sätt att kommunicera i realtid. 
        Ange ditt unika användarnamn och börja chatta med vänner 
        och bekanta. Skapa eller anslut till olika kanaler för 
        att dela tankar, idéer och skratt. Bli en del av vårt 
        gemenskapliga digitala rum och upplev en ny dimension 
        av interaktion. Let's chat with Chattylachatt.</p>
      </div>
<div className="container-avatar">
  <AvatarPicker onSelect={(avatar) => console.log(avatar)} />
  </div>
      
  <label htmlFor='username' className='user-name-login'> Användarnamn: </label>
<input 
className="username-input" 
id="username" type="text" 
value={username} 
onChange={(e:ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
/> 
<button 
className="start-chat-button"
onClick={checkIfUsernameValid}>Börja Chatta</button>
{errorMessage && <p>{errorMessage}</p>}
  </>
  </article>
  
}
</div>
{validUsername && 
<article> 
  <h2>hello {username || localStorageUser}</h2>  


  <CreateMessage  newMessage={newMessage} setNewMessage={setNewMessage}  PostMessage={PostMessage}  />

<section>      
{allRooms?.map((item) => (
        <div key={item.id}  onClick={() => {handleClick(item.roomName);}} >
        <p> {item.roomName} </p> 
        </div>
      ))}
</section>
    <h2>{selectedRoom?.roomName}</h2>
      {selectedRoom?.messages.map((item) => (
        <div key={item.cratedAt + item.user.username } >
          <p> {item.cratedAt} </p> 
        <p> {item.message} </p> 
        <p> {item.user.username} </p> 
        </div>
      ))}
</article>
 }
 
 </div>
      </>
  )
   }
export default App;
