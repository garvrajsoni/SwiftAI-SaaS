import React, { useState } from 'react'
import { Download, Image, Scissors, Sparkle, Sparkles, UploadCloud } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';  
import FormData from 'form-data';
import toast from 'react-hot-toast';


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  
  const [input, setInput] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setcontent] = useState('');
  
  
  const {getToken} = useAuth();


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
      formData.append('object', description);

     const { data } = await axios.post('/api/ai/remove-image-object', formData,{
      headers: {
        'Authorization': `Bearer ${await getToken()}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log("Full response:", data);

      if (data.success) {
        setcontent(data.content);

      }
      else{
        toast.error(data.message);
      }


    } catch (error) {
      toast.error("Error removing object:", error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-start justify-center bg-[#f8f9fc] px-4 py-10">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">
        {/* Left Panel */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-indigo-500" />
          <h1 className="text-xl font-semibold">AI Object Remover</h1>
        </div>

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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe object to remove
            </label>
            <textarea
              placeholder="e.g., car in background, tree from the image"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full text-sm border border-gray-300 rounded-md p-2 resize-none"
              required
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">
              Be specific about what you want to remove
            </p>
          </div>

           <button disabled={loading} className={`w-full flex justify-center items-center gap-2
                      bg-gradient-to-r from-indigo-500 to-purple-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''} text-white px-4 py-2 mt-6 text-sm rounded-1g cursor-pointer`} >
                            <Scissors className='w-5'/>
                            Generate Image
                    </button>
       
        </form>

        {/* Right Panel */}
       <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]'>
        <div className='flex items-center gap-3'>
          <Image className='w-5 h-5 text-[#00AD25]' />
          <h1 className='text-xl font-semibold'>Processed Image</h1>
        </div>
        <div className='flex-1 flex justify-center items-center'>
          <div className='text-sm flex flex-col items-center gap-5 text-gray-400 p-2'>
            <Image className={`${content ? 'hidden' : 'block'} w-9 h-9`} />
              {content && <img src={content} alt="Generated image" className='w-full h-full object-contain' />}
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
    </div>
  );
};

export default RemoveObject;
