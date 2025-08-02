import { useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import ReviewResume from './ReviewResume'
import { dummyPublishedCreationData } from '../assets/assets'
import { Heart } from 'lucide-react'

const Community = () => {
  const [creations, setCreations] = useState([])
  const { user } = useUser()

  const fetchCreations = async () => {
    setCreations(dummyPublishedCreationData)
  }

  useEffect(() => {
    if (user) {
      fetchCreations()
    }
  }, [user])

  return (
    <div className='flex-1 h-full flex flex-col gap-4 p-6'>
      <h2 className="text-xl font-semibold">Creations</h2>

      <div className='bg-white w-full rounded-xl overflow-y-scroll p-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {creations.map((creation, index) => (
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
                  className={`w-5 h-5 hover:scale-110 transition-transform cursor-pointer ${
                    creation.likes.includes(user?.id)
                      ? 'fill-red-500 text-red-600'
                      : 'text-white'
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Community
