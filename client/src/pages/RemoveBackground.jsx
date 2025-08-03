import { Download, Eraser, Image, Scissors, Sparkles, UploadCloud } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import FormData from 'form-data';


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


const RemoveBackground = () => {
  const [input, setInput] = useState(null);
  const {getToken} = useAuth()
  const [loading, setLoading] = useState(false);
  const [content, setcontent] = useState('');


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


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('image', input);

     const { data } = await axios.post('/api/ai/remove-image-background', formData, {
      headers: {
        'Authorization': `Bearer ${await getToken()}`,
        'Content-Type': 'multipart/form-data'
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
    <div className="w-full min-h-screen p-6 flex flex-col md:flex-row gap-6 justify-center items-start text-slate-700 bg-gray-50">
      
      {/* Left Column */}
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-1/2 p-6 bg-white rounded-xl border border-gray-200 flex flex-col gap-4"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#ffc800]" />
          <h1 className="text-xl font-semibold">AI Background Remover</h1>
        </div>

        <p className="text-sm font-medium text-gray-700">Upload an image to remove its background</p>

        {/* Custom File Upload */}
        <div>
          <input
            type="file"
            id="upload"
            accept="image/*"
            className="hidden"
            onChange={(e) => setInput(e.target.files[0])}
            required
          />
          <label
            htmlFor="upload"
            className="flex items-center gap-2 justify-center cursor-pointer w-full border border-dashed border-gray-400 p-4 rounded-lg hover:bg-gray-50 transition"
          >
            <UploadCloud className="w-6 h-6 text-[#ffc800]" />
            <span className="text-sm font-medium text-gray-600">
              Click to upload image
            </span>
          </label>

          {input && (
            <div className="mt-3">
              <p className="text-xs text-yellow-600">Selected: {input.name}</p>
              <img
                accept="image/*"
                src={URL.createObjectURL(input)}
                alt="Preview"
                className="w-40 mt-2 rounded-md border border-gray-300"
              />
            </div>
          )}
        </div>
          
          <button disabled={loading} className={`w-full flex justify-center items-center gap-2
             bg-gradient-to-r from-[#206f03] to-[#00AD25] ${loading ? 'opacity-50 cursor-not-allowed' : ''} text-white px-4 py-2 mt-6 text-sm rounded-1g cursor-pointer`} >
                  <Scissors className='w-5'/>
                  Generate Image
          </button>
        
      </form>
  

      {/* Right Column */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]'>
        <div className='flex items-center gap-3'>
          <Image className='w-5 h-5 text-[#00AD25]' />
          <h1 className='text-xl font-semibold'>Processed Image</h1>
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
  );
};

export default RemoveBackground;
