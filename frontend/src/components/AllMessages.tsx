
import { Room } from '../models/Room'



interface Props {
    selectedRoom: Room
  handelAddUserSearchRoom: (item:string) => void
  showLocalStorageUser?:string
}


export const AllMessages = ({selectedRoom, handelAddUserSearchRoom, showLocalStorageUser}:Props) => {
  
  return (
    <section>
     {selectedRoom?.messages.map((item) => (
        <div key={item.cratedAt + item.user.username } >
          <p> {item.cratedAt} </p> 
        <p> {item.message} </p> 
        {item.user.username === showLocalStorageUser ? <button>Redigera</button> : ''}
        <section onClick={() => handelAddUserSearchRoom(item.user.username)}>
        <img src={item.user.image} alt="" />
        <p> {item.user.username} </p>
      
        </section>
        </div>
      ))}
    
    </section>
  )
}

