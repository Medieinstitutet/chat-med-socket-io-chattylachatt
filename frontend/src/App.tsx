import  { ChangeEvent, useEffect, useState } from "react"; 
import "./App.css";
import './sass/style.scss';
import { Socket, io } from "socket.io-client";
import moment from 'moment-timezone';
import 'moment/dist/locale/sv';
import { Room } from "./models/Room";
function App(){ 



  moment.tz.setDefault('Europe/Stockholm');
  moment.locale('sv');
  const [socket, setSocket] = useState<Socket>();
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room>();
  const [username, setUsername] = useState('')
const [validUsername, setValidUsername] = useState<boolean>(false)




  useEffect(() => {
    if (socket) return;
    const s = io("http://localhost:3000");
    s.on("mainRoom", (mainRoomData: Room[]) => {
      setSelectedRoom(mainRoomData[0]);
    });
    setSocket(s);
  }, [setSocket, socket, ]);
  const handleClick = (roomName: string) => {
    socket?.emit("join_room", roomName, username, (data: Room) => {
      setSelectedRoom(data);
    });
  };



const checkIfUsernameValid =()=>{
  /* Här behöver vi skapa logik för att se om användarnamnet är unikt */
setValidUsername(true)
socket?.emit("allroomsForUser", username,  (rooms: Room[]) => {
  setAllRooms(rooms);
}) 
}





  return (
    <>
{!validUsername && <article>
  <>
  <label htmlFor='username'> Användarnamn: </label>
<input id="username" type="text" value={username} 
onChange={(e:ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
/> 
<button onClick={checkIfUsernameValid}>Börja Chatta</button>
  </>
  </article>
}
{validUsername && 
<article> 
  <h2>hello</h2>      
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
      </>
  )
   }
export default App;
