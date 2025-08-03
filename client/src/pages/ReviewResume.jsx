import { UploadCloud, FileText, Image, Camera, Sparkles, File, Book, Copy } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import FormData from 'form-data';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import ReactMarkdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


const ReviewResume = () => {
  const [input, setInput] = useState(null);
  const {getToken} = useAuth()
  const [loading, setLoading] = useState(false);
  const [content, setcontent] = useState('');

   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('resume', input);

     const { data } = await axios.post('/api/ai/resume-review', formData, {
      headers: {
        'Authorization': `Bearer ${await getToken()}`,
        'Content-Type': 'multipart/form-data'
      }
    });

      if (data.success) {
        setcontent(data.content);
    
      }
      else{
        toast.error(data.message);
        
      }


    } catch (error) {
      toast.error("Error generating article:", error);
      
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen w-full bg-[#f8f9fc] px-4 py-10 flex items-start justify-center">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">
        {/* Left Panel */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 h-fit bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            <Sparkles className="inline-block w-5 h-5 mr-2" /> Resume Review
          </h2>

          {/* Upload Area */}
          <div className="mb-4">
            <input
              type="file"
              id="resumeUpload"
              accept=".pdf, .jpg, .jpeg, .png"
              onChange={(e) => setInput(e.target.files[0])}
              className="hidden"
            />
            <label
              htmlFor="resumeUpload"
              className="flex items-center justify-center gap-2 border border-dashed border-gray-400 rounded-md p-4 cursor-pointer hover:bg-gray-50 transition"
            >
              <UploadCloud className="w-5 h-5 text-teal-500" />
              <span className="text-sm text-gray-600">Choose File</span>
            </label>
            <p className="text-xs text-gray-500 mt-2">Supports PDF, PNG, JPG formats</p>

            {input && (
              <div className="mt-2 text-sm text-gray-700">
                Selected: <strong>{input.name}</strong>
              </div>
            )}
          </div>

           <button disabled={loading} className={`w-full flex justify-center items-center gap-2
bg-gradient-to-r from-teal-500 to-teal-400 ${loading ? 'opacity-50 cursor-not-allowed' : ''} text-white px-4 py-2 mt-6 text-sm rounded-1g cursor-pointer`} >
          <Book className='w-5'/>
          Review Resume
        </button>

        </form>

        

        {/* Right Panel */}
              <div className='relative w-full max-w-lg p-4 bg-white border border-gray-200 min-h-96 max-h-[600px] flex flex-col'>
  <div className='w-full flex items-center justify-between mb-2'>
    <h1 className='text-xl font-semibold flex items-center gap-2'>
      <FileText className='w-5 text-[#4A7AFF]' />
      <span>Resume Review</span>
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
      <p className='text-gray-400'>Please upload a resume to get started</p>
    )}
  </div>
</div>
      </div>
    </div>
  );
};

export default ReviewResume;

