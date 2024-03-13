import { useState, useEffect } from 'react';
import { Room } from '../models/Room'



interface Props {
  selectedRoom: Room;
  handelAddUserSearchRoom: (item:string) => void;
  currentUserUsername: string;
  username:string
  localStorageUser:string
}


export const AllMessages = ({ selectedRoom, handelAddUserSearchRoom, currentUserUsername, username, localStorageUser }: Props) => {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedMessage, setEditedMessage] = useState('');
let edit = false

  
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
    edit=true
  };

  
  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditedMessage('');
    edit=false
  };

 
  const saveEditedMessage = (id: string) => {
    console.log(`Saving edited message for message ID ${id}:${editedMessage}`);
    setEditingMessageId(null); 
    edit=false
  };

  return (
    <section>
     {selectedRoom?.messages.map((item) => (
        <div key={item.cratedAt + item.user.username } className={username === item.user.username  || localStorageUser === item.user.username ? 'user' : 'notUser'} >
          <p> {item.cratedAt} </p> 
        
          {editingMessageId === item.cratedAt + item.user.username ? (

<section className='message'><textarea id="myTextarea"  maxLength={50} minLength={3}  value={editedMessage} onChange={(e) => setEditedMessage(e.target.value)} > </textarea>
<section className='buttons'>     
              <button className='save-edit-btn' onClick={() => saveEditedMessage(item.cratedAt + item.user.username)}>Spara</button>
              <button className='cancel-edit-btn' onClick={cancelEditing}>Avbryt</button>
              </section>








              
           </section>
              
              




          ) : (
            <section className='message'> 
            <p >{item.message}</p>
            <section className='buttons'> 
            {username === item.user.username  && <button className='edit-message-btn' onClick={() => startEditing(item.message, item.cratedAt + item.user.username)}>Redigera</button>  }
            
            </section>
            </section>
          )}
  
        
        <section onClick={() => handelAddUserSearchRoom(item.user.username)}>
        <img src={item.user.image} alt="" />
        <p> {item.user.username} </p>
      
        </section>
        </div>
      ))}
    
    </section>
  );
};


