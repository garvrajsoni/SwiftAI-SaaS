import { Copy, Hash, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


const BlogTittles = () => {

    const blogCategories = ['General',
  'Technology', 'Business', 'Health',
  'Lifestyle', 'Education', 'Travel', 'Food']
  
  const [selectedCategory, setSelectedCategory] = useState(blogCategories[0]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setcontent] = useState('');

    const {getToken} = useAuth()
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prom = `suggest one title for an article about ${input} in ${selectedCategory} category`;
      const { data } = await axios.post('/api/ai/generate-blog-tittle', { prompt: prom}, {
        headers: {
          'Authorization': `Bearer ${await getToken()}`
        }
      });

      if (data.success) {
        setcontent(data.content);
        console.log(data.content);
      }
      else{
        toast.error(data.message);
        console.log(data.message);
      }


    } catch (error) {
      toast.error("Error generating article:", error);
      console.log(error);
    } finally {
      setLoading(false);
    }
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
        
        <button disabled={loading} className={`w-full flex justify-center items-center gap-2
bg-gradient-to-r from-[#226BFF] to-[#65ADFF] ${loading ? 'opacity-50 cursor-not-allowed' : ''} text-white px-4 py-2 mt-6 text-sm rounded-1g cursor-pointer`} >
          <Hash className='w-5'/>
          Generate article
        </button>


      </form>
      {/* Right col */}
      <div className='relative w-full max-w-lg p-4 bg-white border border-gray-200 min-h-96 max-h-[600px] flex flex-col'>
  <div className='w-full flex items-center justify-between mb-2'>
    <h1 className='text-xl font-semibold flex items-center gap-2'>
      <Hash className='w-5 text-[#4A7AFF]' />
      Generated Article
    </h1>
    {content && (
      <Copy
        size={20}
        className='cursor-pointer hover:text-[#4A7AFF]'
        onClick={() => {
          navigator.clipboard.writeText(content);
          toast.success('Copied to clipboard');
        }}
      />
    )}
  </div>


  <div className='flex-1 overflow-y-auto text-sm text-gray-700 whitespace-pre-line pr-2'>
   {content ? <ReactMarkdown>{content}</ReactMarkdown> : (
         <p className='text-gray-400'>Your Generated tittle will appear here...</p>
       )}
  </div>
</div>

    </div>
  )
}

export default BlogTittles