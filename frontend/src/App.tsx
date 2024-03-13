import  { ChangeEvent, useEffect, useState } from "react"; 
import { FaSearch } from "react-icons/fa";
import './sass/style.scss';
import { Socket, io } from "socket.io-client";
import moment from 'moment-timezone';
import 'moment/dist/locale/sv';
import { Room } from "./models/Room";
import { CreateMessage } from "./components/CreateMessage";
import { Message } from "./models/Message";
import AvatarPicker from "./components/AvatarPicker";
import { AllMessages } from "./components/AllMessages";
function App(){ 
  moment.tz.setDefault('Europe/Stockholm');
  moment.locale('sv');
  const [socket, setSocket] = useState<Socket>();
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room>();
  const [newMessage, setNewMessage] = useState('')
  const [username, setUsername] = useState('')
const [validUsername, setValidUsername] = useState<boolean>(false)
const [errorMessage, seterrorMessage] = useState('')
const [localStorageUser, setLocalStorageUser] = useState<string>( '')
const [image, setImage] = useState<string>('')
const localstorageImage: string| null = localStorage.getItem("image")
const showLocalStorageUser: string| null = localStorage.getItem("user");
const [searchUserForRoom, setsearchUserForRoom] = useState<string>('')
const [selectedAvatar, setSelectedAvatar] = useState<string>('');

  useEffect(() => {
    if (socket) return;

    const s = io("http://localhost:3000");
  s.on( "bid_accepted", (product: Room) => {
      setSelectedRoom(product);
    });

    s.on("mainRoom", (mainRoomData: Room[]) => {
      setSelectedRoom(mainRoomData[0]);

      
    });


    s.on(`${username}` , (product) => {
      console.log(product)
    });
    s.on(`${localStorageUser}` , (product) => {
      console.log(product)
    });
   

    setSocket(s);
  }, [setSocket, socket, selectedRoom,localStorageUser]);



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
    
   
      
if(data){

setSelectedRoom(data);


}

    });


  };



 
const checkIfUsernameValid =  () =>{
  /* Här behöver vi skapa logik för att se om användarnamnet är unikt */

if(image !== ''){

  if(username !== '' || localStorageUser !== "" ){
socket?.emit("allroomsForUser", localStorageUser,  username, (valid:boolean, rooms: Room[]) => {
if(valid){
  socket?.emit("join_room", 'main', username, (data: Room) => {
    setSelectedRoom(data);
 
  });
 localStorage.setItem("user", username);
 localStorage.setItem("image", image);
  setAllRooms(rooms)
  setValidUsername(valid)
  socket.on(`${username}` , (data:Room[]) => {
    if(data){
setAllRooms(data)

    }
  });




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
  }}
  else{
    seterrorMessage('Väljen Avatar')
    }
}

const handelLocalStorageUser = () =>{
if(showLocalStorageUser && localstorageImage){
setUsername(showLocalStorageUser)
setLocalStorageUser(showLocalStorageUser)
setImage(localstorageImage)
setSelectedAvatar(localstorageImage)
}

}



const handleFindRoom = ()=> {
 
  if(searchUserForRoom){
   
    socket?.emit("create_room", username, searchUserForRoom, (data: Room[]) => {
      setAllRooms(data);
     if(data){

      socket?.emit("join_room", `${username} ${searchUserForRoom}`, username, (data: Room) => {
        setSelectedRoom(data);
     
      });

  

     }
    
   
   
    })
   
    

   
  }
  }


const handelAddUserSearchRoom = (user:string)  =>  {
  if(username !== user){
    setsearchUserForRoom(user)
  }
   
   
   
  }



  return (
    <>
    
{!validUsername  && <div className="app-login">

<div className="container-login"> 
  <>









  <section  className="localstorageContainer"  >
  <p>Logga in som</p>
  {showLocalStorageUser && localstorageImage && <button onClick={handelLocalStorageUser} className="localstorageContainer___btn" > <h3>{showLocalStorageUser}  </h3>     <img alt='' className="localstorageContainer___img" src={localstorageImage} /> </button> }

  </section>













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
  <AvatarPicker onSelect={(avatar) => console.log(avatar)}          selectedAvatar={selectedAvatar} setSelectedAvatar={setSelectedAvatar}      setImage={setImage} />
  </div>












  
      <section className="btnAndUsername"> 
  <label htmlFor='username' className='user-name-login'> Användarnamn: </label>
<input 
className="username-input" 
id="username" type="text" 
value={username} 
maxLength={10}

onChange={(e:ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
/> 
<button 
className="start-chat-button"
onClick={checkIfUsernameValid}>Börja Chatta</button>
{errorMessage && <p>{errorMessage}</p>}
</section>
  </>
  </div>
  </div>

  
  
}




































{validUsername && 
<article className="chatContainer"> 
 


 

<section className="sectionOne">      
<section className="findRoomContainer">
  <section className="usernameAndImg"> 
 
 <img src={image} />
 <h2>{username}</h2>
 </section>
 <input className="findRoomInput" type="text" value={searchUserForRoom} maxLength={10}  onChange={(e:ChangeEvent<HTMLInputElement>) => setsearchUserForRoom(e.target.value)} />
 <button className="findRoomBtn" onClick={handleFindRoom}> <FaSearch /> </button>
   </section>
<section className="allRoomsContainer"> 
{allRooms?.map((item) => (
        <div key={item.id}  onClick={() => {handleClick(item.roomName);}} >
        <p> {item.roomName.replace(`${username}`,'')} </p> 
       
        </div>
      ))}
      </section>
</section>


<section className="sectionTwo">         

<h2>{ selectedRoom?.roomName.replace(`${username}`,'')}</h2>
<section className="allmessageContainer"> 
   
<AllMessages selectedRoom={selectedRoom} handelAddUserSearchRoom={handelAddUserSearchRoom} username={username} localStorageUser={localStorageUser} />  

</section>






<CreateMessage  newMessage={newMessage} setNewMessage={setNewMessage}  PostMessage={PostMessage}  />

</section>
</article>
 }


      </>
  )
   }
export default App;
