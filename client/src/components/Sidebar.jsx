import { Protect, useClerk, useUser } from '@clerk/clerk-react';
import { House, SquarePen, Hash, Image, Eraser, Scissors, FileText, Users, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
    { to: '/ai', label: 'Dashboard', Icon: House },
    { to: '/ai/write-articles', label: 'Write Article', Icon: SquarePen },
    { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Hash },
    { to: '/ai/generate-images', label: 'Generate Images', Icon: Image },
    { to: '/ai/remove-background', label: 'Remove Background', Icon: Eraser },
    { to: '/ai/remove-object', label: 'Remove Object', Icon: Scissors },
    { to: '/ai/review-resume', label: 'Review Resume', Icon: FileText },
    { to: '/ai/community', label: 'Community', Icon: Users },
]


const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <div className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-around items-center max-sm:absolute top-14 bottom-0 ${sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'} transition-all z-1000 duration-300 ease-in-out`}>
      {user && (
     <div className='my-0 w-full'>
    <img src={user.imageUrl} alt="User avatar" className='w-13 rounded-full mx-auto' />
    <h1 className='mt-1 text-center'>{user.fullName}</h1>
  </div>
)}

        <div className="space-y-2">
          {navItems.map(({ to, label, Icon}) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/ai'}
              onClick={() => setSidebar(false)}
              className={({ isActive }) => `px-3.5 py-2.5 flex items-center gap-3 rounded ${isActive ? 'bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white' : ''}`}
            >
              {({ isActive }) => (
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                  <span>{label}</span>
                </div>
              )}
            </NavLink>
          ))}
        </div>

<div className='justify-between flex items-center w-full px-3.5 py-2.5 mt-4 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors duration-200' onClick={() => setSidebar(false)}>
  {user && (<div onClick={openUserProfile} className='flex gap-2 items-center cursor-pointer'>
    <img src={user.imageUrl} className='w-8 rounded-full' alt="User avatar" />
    <div>
      <h1 className='text-sm font-medium'>{user.fullName}</h1>
      <p className='text-xs text-gray-500'>
        <Protect plan='premium' fallback='Free'>Premium</Protect>
      </p>
    </div>
  </div>)}
  <button onClick={signOut} className='text-gray-400 hover:text-gray-700'>
    <LogOut/>
  </button>
  </div>
</div>
  );
}

export default Sidebar;
