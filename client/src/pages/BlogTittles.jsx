import { Hash, Sparkles } from 'lucide-react';
import React, { useState } from 'react'

const BlogTittles = () => {

    const blogCategories = ['General',
  'Technology', 'Business', 'Health',
  'Lifestyle', 'Education', 'Travel', 'Food']
  
  const [selectedCategory, setSelectedCategory] = useState(blogCategories[0]);
  const [input, setInput] = useState('');

const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Generating article with topic:', input, 'and length:', selectedCategory);
  }


  return (
    <div className='h-full overflow-y-scroll p-6 flex justify-center gap-4 flex-wrap items-start text-slate-700'>
      {/* left col */}
      <form  onSubmit={handleSubmit} className='max-w-lg min-h-96 max-h-[600px] p-4 bg-white rounded-1g border border-gray-200'>
        <div className='w-full flex items-center gap-3'>
          <Sparkles className='w-6 text-[#8E37EB]'/>
          <h1 className='text-xl font-semibold'>AI Title Generator</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Keywords</p>
        <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' placeholder='The future of artificial intelligence is...' required/>
        <p className='mt-4 text-sm font-medium'>Category</p>

        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
          {
            blogCategories.map((item, index) => (
              <span onClick={()=>setSelectedCategory(item)} className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedCategory === item ? 'bg-purple-50 text-purple-700' : 'text-gray-500 border-gray-300'}`} key={index}>{item}</span>
            ))
          }
        </div>

        <br/>
        
        <button className='w-full flex justify-center items-center gap-2
bg-gradient-to-r from-[#8E37EB] to-[rgb(211,50,226)] text-white px-4 py-2 mt-6 text-sm rounded-1g cursor-pointer' >
          <Hash className='w-5'/>
          Generate article
        </button>


      </form>
      {/* Right col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]'>
        <div className='flex items-center gap-3'>
          <Hash className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Generated titles</h1>
        </div>
        <div className='flex-1 flex justify-center items-center'>
          <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
            <Hash className='w-9 h-9' />
            <p>Enter a topic and click "Generate title" to get started</p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default BlogTittles