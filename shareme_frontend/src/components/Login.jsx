import React, { useEffect } from 'react'
import {GoogleLogin ,googleLogout} from '@react-oauth/google';
import {useNavigate} from 'react-router-dom';
import {FcGoogle} from 'react-icons/fc';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logo.png';
import jwt_decode from 'jwt-decode';
import { client } from '../client';
const Login = () => {
  const navigate = useNavigate();
  const createOrGetUser = async (response )=>{
    const decode = jwt_decode(response.credential)
    localStorage.setItem('user',JSON.stringify(decode))
    const{name,picture,sub} =decode;

    const user = {
        _id:sub,
        _type:'user',
        userName:name,
        image:picture
    } 
    client.createIfNotExists(user).then(()=>{
    navigate('/',{replace:true})
    })
  }
 
  return (
    <div className='flex justify-start items-center flex-col h-screen'>
     <div className='relative w-full h-full '>
       <video src={shareVideo}
       type="video/mp4"
       loop
       controls={false}
       muted
       autoPlay
       className='w-full h-full object-cover'
       />
       
       <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
        <div className='p-5'>
              <img src={logo}  width="135px" alt="logo" />

        </div>
        <div className='shadow-2xl'>
          
            <GoogleLogin 
            onSuccess={credentialResponse => {
            createOrGetUser(credentialResponse)
                    }}
            onError={() => {
            console.log('Login Failed');
                }}
            >

            </GoogleLogin>
        </div>
       </div>
     </div>
    </div>
  )
} 

export default Login