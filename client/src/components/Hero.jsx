import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react'
import { assets } from '../assets/assets';

const Hero = () => {
    const { user } = useUser();
    const Navigate = useNavigate();

    const proceed = () => {
        if(user) {
            Navigate('/ai');
        } else {
            alert('Please sign in to continue');
        }
    }

  return (
    <div className="px-4 sm:px-20 x1:px-32 relative inline-flex flex-col w-full justify-center bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2]">
          Create amazing content <br /> with <span className='text-primary font-extrabold'>AI tools</span>
        </h1>
        <p>
          Transform your content creation with our suite of premium AI tools. Write articles,
        </p>
      </div>

        <div className='flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs'>
          <button onClick={proceed} className='bg-primary text-white px-10 py-3 rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer'>Start creating now</button>
          <button className='bg-white px-10 py-3 rounded-lg border border-gray-300 hover:scale-102 active:scale-95 transition cursor-pointer'>Watch demo</button>
        </div>

        <div className='flex items-center gap-4 mt-8 mx-auto text-gray-600'>
          <img src={assets.user_group} alt="User Group" className='h-8' /> Trusted by 10k+ people
        </div>
        
    </div>
  )
}

export default Hero;
