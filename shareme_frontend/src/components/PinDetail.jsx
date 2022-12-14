import {useState,useEffect} from 'react'
import {MdDownloadForOffline} from "react-icons/md";
import {Link,useParams} from 'react-router-dom';
import {v4 as uuid} from 'uuid';
import {client,urlFor} from '../client';
import MasonryLayout from './MasonryLayout'
import {pinDetailMorePinQuery,pinDetailQuery} from '../utils/data'
import Spinner from './Spinner';

const PinDetail = ({user}) => {
const [pins, setPins] = useState(null);
const [pinDetail, setPinDetail] = useState(null);
const [comment, setComment] = useState("")
const [addingComment, setAddingComment] = useState(false)
const {pinId}=useParams();
const addComment = ()=>{
if(comment){
  setAddingComment(true);
  client.patch(pinId)
        .setIfMissing({comments:[]})
        .insert('after','comments[-1]',[{
          comment,
          _key:uuid(),
          postedBy:{
            _type:'postedBy',
            _ref:user._id
          }
        }])
        .commit().then(()=>{
          fetchPinDetail();
          setComment('');
          setAddingComment(false);
        }
        )
}
}

const fetchPinDetail= () => {
  let query = pinDetailQuery(pinId)
  if(query){
   client.fetch(query)
   .then((data)=>{
    setPinDetail(data[0]);
    if(data[0]){
      query = pinDetailMorePinQuery(data[0]);
      client.fetch(query)
      .then((res)=>{
        setPins(res)
      })
    }
   })

  }
}
useEffect(() => {
  fetchPinDetail()
}, [pinId]);

if(!pinDetail) return <Spinner message="loading the pin"/>

  return (
    <>
    <div className='flex xl-flex-row flex-col m-auto bg-white' style={{maxWidth:'1500px', borderRadius:'32px'}}>
      <div className="flex justify-center items-center md:items-start flex-initial">
<img src={pinDetail?.image && urlFor(pinDetail.image).url() } alt="pin-pic"
className='rounded-t-3xl rounded-b-lg'
/>
      </div>
      <div className="w-full p-5 flex-1 xl:min-w-620">
         <div className="flex items-center justify-start">
          <div className="flex gap-2 items-center">
          <a href={`${pinDetail.image.asset?.url}?dl=`}
        download
        onClick={(e)=>e.stopPropagation()}
        className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none">
          <MdDownloadForOffline/>
        

            </a>
            
          </div>
          <a href={pinDetail.destination} target="_blank" rel='noreferrer'>
              {pinDetail.destination}
            </a>
         </div>
    <Link to={`user-profile/${pinDetail.postedBy?._id}`}
     className="flex gap-2 mt-2 items-center justify-end">
    <img src={pinDetail.postedBy?.image} className='w-8 h-8 rounded-full object-cover' alt="user-profile" />
    <p className="font-semibold capitalize">{pinDetail.postedBy?.userName}</p>
    </Link>
<div>
  <h1 className="text-4xl break-words font-bold mt-3">
    {pinDetail.title}
  </h1>
  <p className='mt-3'>{pinDetail.about}</p>
</div>

<h2 className='mt-5 text-2xl'> Comments</h2>
      
<div className="max-h-370 overflow-w-auto">
  {pinDetail?.comments?.map((comment,i) => (
    <div key={i} className="flex gap-2 mt-5 items-center bg-white rounded-lg">
      <img src={comment.postedBy.image} alt="user-profile"
      className='w-10 h-10 rounded-full cursor-pointer' />
      <div className="flex flex-col">
        <p className="font-bold">
          {comment.postedBy.userName}
        </p>
        <p>{comment.comment}</p>
      </div>
    </div>
  ))}
</div>
<div className='flex flex-wrap mt-6 gap-3'>
<Link to={`user-profile/${pinDetail.postedBy?._id}`}
    >
    <img src={pinDetail.postedBy?.image} className='w-10 h-10 rounded-full cursor-pointer' alt="user-profile" />
</Link>
<input type="text" name="" placeholder='Add a comment' 
className='flex-1 border-2 border-gray-100 outline-none p-2 rounded-2xl focus:border-red-300'
value={comment}
onChange={(e)=>setComment(e.target.value)} />
<button
onClick={addComment}
className='bg-red-500 text-white py-2 px-6 text-base outline-none rounded-full font-semibold '>
{addingComment ? 'Posting the comment...' : 'Post'}
</button>
</div>
      </div>
          </div>
    { pins?.length > 0 ? (
      <>
      <h2 className='text-center text-2xl text-bold mt-8 mb-4 '>More Like this</h2>
      <MasonryLayout pins={pins}></MasonryLayout>
      </>
    ):(
     <Spinner message="loading more like that "/>
    )}
    </>
  )

}

export default PinDetail