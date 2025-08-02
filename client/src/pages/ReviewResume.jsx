import { UploadCloud, FileText, Image, Camera, Sparkles, File, Book } from 'lucide-react';
import React, { useState } from 'react';

const ReviewResume = () => {
  const [input, setInput] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input) {
      alert("Please upload a resume.");
      return;
    }

    console.log('Processing resume:', input);
  };

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

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-500 to-teal-400 hover:opacity-90 text-white font-medium text-sm py-2 rounded-md flex items-center justify-center gap-2 transition"
          >
            <FileText className="w-4 h-4" />
            Review Resume
          </button>
        </form>

        {/* Right Panel */}
        <div className="flex-1 min-h-[300px] bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            <File className="inline-block w-5 h-5 mr-2" /> Analysis Results
          </h2>

          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400">
            <FileText className="w-10 h-10 mb-2" />
            <p className="text-sm">Upload your resume and click “Review Resume” to get started</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewResume;

