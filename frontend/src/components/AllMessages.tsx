import { useState, useEffect } from 'react';
import { Room, } from '../models/Room'
import '../sass/_editAllMessages.scss';
import io from 'socket.io-client';
import { Message } from '../models/Message'; 


const socket = io('http://localhost:3000');

interface Props {
  selectedRoom: Room;
  handleAddUserSearchRoom: (item:string) => void;
  currentUserUsername: string;
}


export const AllMessages = ({ selectedRoom, handleAddUserSearchRoom, currentUserUsername }: Props) => {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedMessage, setEditedMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(selectedRoom.messages);

  useEffect(() => {
    setMessages(selectedRoom.messages);
  }, [selectedRoom]);

  useEffect(() => {
    const handleUpdate = (data: { cratedAt: string; newMessage: string; username: string }) => {
      if (editingMessageId === data.cratedAt) {
        setMessages((prevMessages) => 
          prevMessages.map((msg) => 
            msg.cratedAt === data.cratedAt ? { ...msg, message: data.newMessage } : msg
          )
        );
        setEditingMessageId(null);
        setEditedMessage('');
      }
    };

    socket.on('message-updated', handleUpdate);
    return () => {
      socket.off('message-updated', handleUpdate);
    };
  }, [editingMessageId]);

  const startEditing = (message: string, cratedAt: string) => {
    setEditingMessageId(cratedAt);
    setEditedMessage(message);
  };

  
  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditedMessage('');
  };

 
  const saveEditedMessage = (cratedAt: string ) => {
    const updatedMessage = {
      cratedAt: cratedAt,
      newMessage: editedMessage,
      username: currentUserUsername,
    };
    console.log("Sending update:", updatedMessage);
    socket.emit('update-message', updatedMessage);
    setEditingMessageId(null); 
    
  };

  return (
    <section className="messages-container">
      {messages.map((item, index) => (
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


