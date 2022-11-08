import {useState,useEffect} from 'react'
import {  AiOutlineLogout} from "react-icons/ai";
import { useParams,useNavigate } from "react-router-dom";

import {userCreatedPinsQuery,userQuery,userSavedPinsQuery} from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { client } from '../client';

const UserProfile = () => {
  const activeBtnStyle = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
  const notActiveBtnStyle = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('created');
  const navigate = useNavigate();
  const {userId} = useParams();
  const randImage = "https://source.unsplash.com/1600x900/?nature,photography,technology"
  useEffect(() => {
   const query = userQuery(userId);
   client.fetch(query)
   .then((data)=>{
    setUser(data[0])
   })
  }, [userId])
  useEffect(() => {
    if(text==="Created"){
    const createdPinsQuery = userCreatedPinsQuery(userId);
    client.fetch(createdPinsQuery)
    .then((data)=>setPins(data))
    }else{
      const savedPinsQuery = userSavedPinsQuery(userId);
      client.fetch(savedPinsQuery)
      .then((data)=>setPins(data))
    }
    
  }, [text,userId])
  
  const logout = ()=>{
    localStorage.clear()
    navigate('/login')
  }
  if(!user){
    return <Spinner message="Loading Profile ...." /> ;
  }
  return (
    <div className='relative pb-2 h-full justify-center items-center'>
<div className="flex flex-col mb-5">
  <div className="relative flex flex-col mb-7">
    <div className="flex flex-col justify-center items-center">
<img src={randImage} alt="banner-pic" className='w-full h-370 2xl:h-510 shadow-lg object-cover' />
<img src={user.image} alt="user-profile" className='rounded-full w-20 h-20 -mt-10 shadow-xl object-cover' />
<h1 className="font-bold text-3xl text-center mt-3">{user.userName}</h1>
<div className="absolute top-0 z-1 right-0 p-2">
  
  {userId === user._id && (
   <button
   type="button"
   onClick={logout}
   className=" bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
   
 >
   <AiOutlineLogout color="red" fontSize={21} />
 </button>
  )}
</div>
    </div>
    <div className='text-center mb-7 mt-4'>
      <button 
      type='button'
      onClick={(e)=>{setText(e.target.textContent)
      setActiveBtn('created')
      }
      }
className={`${activeBtn === 'created' ? activeBtnStyle : notActiveBtnStyle}  `}
      >
      Created
      </button>
      <button 
      type='button'
      onClick={(e)=>{setText(e.target.textContent)
      setActiveBtn('saved')
      }
      }
className={`${activeBtn === 'saved' ? activeBtnStyle : notActiveBtnStyle}  `}
      >
      Saved
      </button>
    </div>
    {pins?.length > 0 ?  (
      <div className="px-2">
      <MasonryLayout pins={pins} />
    </div>
    ) : (
      <div className='flex justify-center items-center font-bold w-full text-xl mt-5'>
You dont have any posts {activeBtn === "saved" ? "saved" : "created"}
      </div>
    )}
    
  </div>
</div>
    </div>
  )
}

export default UserProfile