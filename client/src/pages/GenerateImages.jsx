import { useAuth } from '@clerk/clerk-react';
import { Brush, Download, Hash, Image, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


const GenerateImages = () => {

  const Imagestyle = ['Realistic', 'Ghibli style', 'Anime style', 'Cartoon style',
'Fantasy style', 'Realistic style', '3D style', 'Portrait style']

const [selectedStyle, setSelectedstyle] = useState(Imagestyle[0]);
  const [input, setInput] = useState('');
  const [publish,setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setcontent] = useState('');

  const {getToken} = useAuth()
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prom = `generate image about ${input} in ${selectedStyle} style`;
      const { data } = await axios.post('/api/ai/generate-image', { prompt: prom, publish: publish}, {
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

  const handleDownload = async () => {
    const imageUrl = content;
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "swiftAi-generated-image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);
  };


  return (
    <div className='h-full overflow-y-scroll p-6 flex justify-center gap-4 flex-wrap items-start text-slate-700'>
      {/* left col */}
      <form  onSubmit={handleSubmit} className='max-w-lg min-h-96 p-4 bg-white rounded-lg border border-gray-200'>
        <div className='w-full flex items-center gap-3'>
          <Sparkles className='w-6 text-[#00AD25]'/>
          <h1 className='text-xl font-semibold'>AI Image Generator</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Describe your Image</p>
        <textarea rows={4} onChange={(e)=>setInput(e.target.value)} value={input} type="text" className='w-full max-h-[300px] p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' placeholder='The future of artificial intelligence is...' required/>
        <p className='mt-4 text-sm font-medium'>Category</p>

        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
          {
            Imagestyle.map((item, index) => (
              <span onClick={()=>setSelectedstyle(item)} className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedStyle === item ? 'bg-green-50 text-green-700' : 'text-gray-500 border-gray-300'}`} key={index}>{item}</span>
            ))
          }
        </div>

        <div className='my-6 flex items-center gap-2'>
          <label className='relative cursor-pointer'>
            <input type="checkbox" className='sr-only peer' checked={publish} onChange={(e) => setPublish(e.target.checked)} />

            <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition"></div>
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4"></span>
          </label>
          <p className='text-sm'>Make this image Public </p>
        </div>

        <button disabled={loading} className={`w-full flex justify-center items-center gap-2
        bg-gradient-to-r from-[#206f03] to-[#00AD25] ${loading ? 'opacity-50 cursor-not-allowed' : ''} text-white px-4 py-2 mt-6 text-sm rounded-1g cursor-pointer`} >
                  <Brush className='w-5'/>
                  Generate Image
                </button>


      </form>
      {/* Right col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]'>
        <div className='flex items-center gap-3'>
          <Image className='w-5 h-5 text-[#00AD25]' />
          <h1 className='text-xl font-semibold'>Generated Image</h1>
        </div>
        <div className='flex-1 flex justify-center items-center'>
          <div className='text-sm flex flex-col items-center gap-5 text-gray-400 p-2'>
            <Image className={`${content ? 'hidden' : 'block'} w-9 h-9`} />
            <img src={content} alt="Generated image" className='w-full h-full object-contain' />
          </div>
        </div>
        <button className='w-full flex justify-center items-center gap-2 bg-green-500 text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'
          onClick={handleDownload}
        >
          <Download className='w-5'/>
          Download
        </button>
      </div>

    </div>
  )
}

export default GenerateImages