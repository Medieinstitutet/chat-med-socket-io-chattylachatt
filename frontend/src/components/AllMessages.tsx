import { useState, useEffect } from 'react';
import { Room } from '../models/Room'
import moment from 'moment-timezone';
import 'moment/dist/locale/sv';



interface Props {
  selectedRoom: Room;
  handelAddUserSearchRoom: (item:string) => void;
  currentUserUsername: string;
  username:string
  localStorageUser:string
  image:string
}


export const AllMessages = ({ selectedRoom, handelAddUserSearchRoom, currentUserUsername, username, localStorageUser, image }: Props) => {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedMessage, setEditedMessage] = useState('');
 

  
  const scrollToBottom = () => {
    const element = document.querySelector<HTMLDivElement>('.allmessageContainer');
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  };
 
  useEffect(() => {
    scrollToBottom()
  }, [selectedRoom])
  
  

  const startEditing = (message: string, id: string) => {
    setEditingMessageId(id);
    setEditedMessage(message);
 
  };

  
  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditedMessage('');
   
  };

 
  const saveEditedMessage = (id: string) => {
    console.log(`Saving edited message for message ID ${id}:${editedMessage}`);
    setEditingMessageId(null); 
  
  };




  return (
    <section>
     {selectedRoom?.messages.map((item) => (
        <div key={item.cratedAt + item.user.username } className={username === item.user.username  || localStorageUser === item.user.username ? 'user' : 'notUser'} >




        <section className='timeAndMessage'>       
          <div className='time'>   <p className='time'>{moment(item.cratedAt, "YYYY-MM-DD HH:mm:ss").fromNow()}</p>    </div>
       







          {editingMessageId === item.cratedAt + item.user.username ? (

<section className='message'>
  <div className='bubble bubble-alt rainbow '>
  <textarea id="myTextarea"   maxLength={50} minLength={3}  value={editedMessage} onChange={(e) => setEditedMessage(e.target.value)} > </textarea>
  </div>
<section className='buttons'>     
              <button className='save-edit-btn' onClick={() => saveEditedMessage(item.cratedAt + item.user.username)}>Spara</button>
              <button className='cancel-edit-btn' onClick={cancelEditing}>Avbryt</button>
              </section>








              
           </section>
              
              




          ) : (
            
            <section className='message'>
              <div className={username === item.user.username  || localStorageUser === item.user.username ? 'bubble bubble-alt rainbow' : 'bubble pink'}>
                
              <p  className='messageBubble'>{item.message}</p>
                </div> 
         
           
            {username === item.user.username  &&  <section className='buttons'>  <button className='edit-message-btn' onClick={() => startEditing(item.message, item.cratedAt + item.user.username)}>Redigera</button> </section>  }
            
            
            </section>
          )}
          </section>
  
        
        <section className='profilContainer' onClick={() => handelAddUserSearchRoom(item.user.username)}>
        <img src={username === item.user.username ? image : item.user.image } alt="" />
        <p> {item.user.username} </p>
      
        </section>
        </div>
      ))}
    
    </section>
  );
};


