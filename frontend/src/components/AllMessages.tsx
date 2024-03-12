
import { Room } from '../models/Room'



interface Props {
    selectedRoom: Room
  handelAddUserSearchRoom: (item:string) => void

}


export const AllMessages = ({selectedRoom, handelAddUserSearchRoom}:Props) => {
  
  return (
    <section>
     {selectedRoom?.messages.map((item) => (
        <div key={item.cratedAt + item.user.username } >
          <p> {item.cratedAt} </p> 
        <p> {item.message} </p> 
      
        <section onClick={() => handelAddUserSearchRoom(item.user.username)}>
        <img src={item.user.image} alt="" />
        <p> {item.user.username} </p>
      
        </section>
        </div>
      ))}
    
    </section>
  )
}

