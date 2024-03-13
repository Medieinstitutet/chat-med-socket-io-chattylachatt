import { useState } from 'react';
import { Room } from '../models/Room'
import '../sass/_editAllMessages.scss';


interface Props {
  selectedRoom: Room;
  handleAddUserSearchRoom: (item:string) => void;
  currentUserUsername: string;

}


export const AllMessages = ({ selectedRoom, handleAddUserSearchRoom, currentUserUsername }: Props) => {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedMessage, setEditedMessage] = useState('');


  const startEditing = (message: string, id: string) => {
    setEditingMessageId(id);
    setEditedMessage(message);
  };

  
  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditedMessage('');
  };

 
  const saveEditedMessage = (id: string) => {
    console.log(`Saving edited message for message ID ${id}: ${editedMessage}`);
    setEditingMessageId(null); 
  };

  return (
    <section className="messages-container">
      {selectedRoom?.messages.map((item, index) => (
        <div key={item.cratedAt + item.user.username + index}> 
          <p className='message-time'>{item.cratedAt}</p>
          {editingMessageId === item.cratedAt + item.user.username ? (
            <div className='message-editing'>
              <textarea className='editing-textarea' value={editedMessage} onChange={(e) => setEditedMessage(e.target.value)} />
              <button className='save-edit-btn' onClick={() => saveEditedMessage(item.cratedAt + item.user.username)}>Spara</button>
              <button className='cancel-edit-btn' onClick={cancelEditing}>Avbryt</button>
            </div>
          ) : (
            <p>{item.message}</p>
          )}

          <section onClick={() => handleAddUserSearchRoom(item.user.username)}>
            <img src={item.user.image} alt={item.user.username} />
            <p>{item.user.username}</p>
          </section>

          {item.user.username === currentUserUsername && (
            <button className='edit-message-btn' onClick={() => startEditing(item.message, item.cratedAt + item.user.username)}>Redigera</button>
          )}
        </div>
      ))}
    </section>
  );
};
