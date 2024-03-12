
import { Room } from '../models/Room'



interface Props {
    selectedRoom?: Room
  handelAddUserSearchRoom: (item:string) => void
  username:string
  localStorageUser:string

}


export const AllMessages = ({selectedRoom, handelAddUserSearchRoom, username, localStorageUser}:Props) => {
  
  return (
    <section>
     {selectedRoom?.messages.map((item) => (
        <div key={item.cratedAt + item.user.username } className={username === item.user.username  || localStorageUser === item.user.username ? 'user' : 'notUser'} >
          <p> {item.cratedAt} </p> 
        <p> {item.message} </p> 
        {username === item.user.username  || localStorageUser === item.user.username ? <button> Redigera </button>: ''}
        <section onClick={() => handelAddUserSearchRoom(item.user.username)}>
        <img src={item.user.image} alt="" />
        <p> {item.user.username} </p>
      
        </section>
        </div>
      ))}
    
    </section>
  )
}

