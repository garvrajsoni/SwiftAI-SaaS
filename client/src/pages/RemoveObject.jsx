import React, { useState } from 'react'
import { Image, Scissors, Sparkle, Sparkles } from 'lucide-react';

const RemoveObject = () => {
  const [input, setInput] = useState(null);
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!input || !description.trim()) {
      alert("Please upload an image and enter a description.");
      return;
    }

    console.log("Processing image:", input, "with description:", description);
  };

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

          <div className="mb-4 mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setInput(e.target.files[0])}
              className="w-full text-sm border border-gray-300 rounded-md p-2 bg-white"
              required
            />
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

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 text-white text-sm font-medium py-2 rounded-md flex items-center justify-center gap-2 transition"
          >
            <Scissors className="w-4 h-4" />
            Remove object
          </button>
        </form>

        {/* Right Panel */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
         
            <div className="flex items-center gap-3">
                      <Scissors className="w-5 h-5 text-indigo-500" />
                      <h1 className="text-xl font-semibold">Processed Output</h1>
                    </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400">
            <Image className="w-10 h-10 mb-2" />
            <p className="text-sm">Upload an image and describe what to remove</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveObject;
