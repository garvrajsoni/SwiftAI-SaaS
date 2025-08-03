import { useAuth, useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


const Community = () => {
  const [creations, setCreations] = useState([])
  const { user } = useUser()
  const {getToken} = useAuth()
  const [loading, setLoading] = useState(false)
  const fetchCreations = async () => {
    try{
      console.log("Fetching creations","Token" , await getToken())
       const {data}= await axios.get('/api/user/get-published-creations', 
        {
          headers: {
            'Authorization': `Bearer ${await getToken()}`
          }
        }
       )

       if(data.success){
        setCreations(data.creations)
        console.log(data.creations)
       }
       else{
        toast.error(data.message)
       }
    }
    catch(error){
      toast.error("Error fetching creations:", error);
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchCreations()
    }
  }, [user])


  const handleLikeToggle = async (creationId) => {
  try {
    const token = await getToken();
    const { data } = await axios.post(
      '/api/user/toggle-like-creation',
      { creationId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.success) {
      setCreations((prev) =>
        prev.map((creation) =>
          creation.id === creationId
            ? { ...creation, likes: data.updatedLikes }
            : creation
        )
      );
    } else {
      toast.error(data.message || "Something went wrong.");
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to toggle like.");
  }
};


  return (
    <div className='flex-1 h-full flex flex-col gap-4 p-6'>
      <h2 className="text-xl font-semibold">Creations</h2>

     <div className='bg-white w-full rounded-xl overflow-y-scroll p-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
  {loading ? (
    <div className="col-span-full flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
    </div>
  ) : (
    creations
      .filter((creation) => creation.publish)
      .map((creation, index) => (
        <div key={index} className='relative my-2 sm:my-0 w-full aspect-square overflow-hidden rounded-lg group'>
          <img
            src={creation.content}
            alt="creation"
            className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
          />

          <div className='absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white'>
            <p className='text-sm mb-2'>{creation.prompt}</p>
            <div className='flex gap-2 items-center justify-end'>
              <p className='text-sm'>{creation.likes.length}</p>
              <Heart
  onClick={() => handleLikeToggle(creation.id)}
  className={`w-5 h-5 hover:scale-110 transition-transform cursor-pointer ${
    creation.likes.includes(user?.id)
      ? 'fill-red-500 text-red-600'
      : 'text-white'
  }`}
/>
            </div>
          </div>
        </div>
      ))
  )}
</div>

    </div>
  )
}

export default Community
