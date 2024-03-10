import React, { ChangeEvent } from 'react'



interface Props {
  PostMessage: () => void
 newMessage:string
 setNewMessage:(newMessage:string) =>void
}

export const CreateMessage = ({PostMessage, newMessage, setNewMessage}:Props) => {
  


  return (
    <>
  
    
    <div >
      <label htmlFor='newMessage'>Skicka ett meddelande</label>
      <textarea id="newMessage" cols={30} rows={10} maxLength={250} minLength={3}  value={newMessage} onChange={(e:ChangeEvent<HTMLTextAreaElement>) => setNewMessage(e.target.value)}></textarea>
      <button onClick={PostMessage}>Skicka</button>
       </div>
    
    
    </>
  )
}

