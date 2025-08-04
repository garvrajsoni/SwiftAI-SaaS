import { Copy, Edit, Sparkles } from 'lucide-react'
import React, {useState } from 'react'

import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


const WriteArticles = () => {

  const articleLength = [
    {length: 500, text: 'Short (500-800 words)'},
 {length: 1200, text: 'Medium (800-1200 words)'},
 {length: 1600, text: 'Long (1200+ words)'}
  ]


  const [seletedLength, setSelectedLength] = useState(articleLength[0].length);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setcontent] = useState('');

  const {getToken} = useAuth()


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prom = `write an article about ${input} in ${seletedLength.text}`;
      const { data } = await axios.post('/api/ai/generate-article', { prompt: prom, length: seletedLength.length }, {
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
    <div className='h-full p-6 flex justify-center flex-wrap items-start gap-4 text-slate-700'>
      {/* left col */}
      <form  onSubmit={handleSubmit} className='max-w-lg min-h-96 max-h-[600px] p-4 bg-white rounded-1g border border-gray-200'>
        <div className='w-full flex items-center gap-3'>
          <Sparkles className='w-6 text-[#4A7AFF]'/>
          <h1 className='text-xl font-semibold'>AI Article Generator</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Article Topic</p>
        <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' placeholder='The future of artificial intelligence is...' required/>
        <p className='mt-4 text-sm font-medium'>Article Content</p>

        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
          {
            articleLength.map((item, index) => (
              <span onClick={()=>setSelectedLength(item.length)} className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${seletedLength === item.length ? 'bg-blue-50 text-blue-700' : 'text-gray-500 border-gray-300'}`} key={index}>{item.text}</span>
            ))
          }
        </div>

        <br/>
        
        <button disabled={loading} className={`w-full flex justify-center items-center gap-2
bg-gradient-to-r from-[#226BFF] to-[#65ADFF] ${loading ? 'opacity-50 cursor-not-allowed' : ''} text-white px-4 py-2 mt-6 text-sm rounded-1g cursor-pointer`} >
          <Edit className='w-5'/>
          Generate article
        </button>


      </form>

      {/* Right Column */}
<div className='relative w-full max-w-lg p-4 bg-white border border-gray-200 min-h-96 max-h-[600px] flex flex-col'>
  <div className='w-full flex items-center justify-between mb-2'>
    <h1 className='text-xl font-semibold flex items-center gap-2'>
      <Edit className='w-5 text-[#4A7AFF]' />
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
    {content ? <Markdown>{content}</Markdown> : (
         <p className='text-gray-400'>Your Generated article will appear here...</p>
       )}
  </div>
</div>
</div>
  )
}

export default WriteArticles