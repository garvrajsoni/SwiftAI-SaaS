import { Eraser, Image, Scissors, Sparkles, UploadCloud } from 'lucide-react';
import React, { useState } from 'react';

const RemoveBackground = () => {
  const [input, setInput] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!input) {
      alert("Please upload an image first.");
      return;
    }

    console.log('Removing background from image:', input);
  };

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

        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#ffc800] to-[#ffb743] text-white px-4 py-2 mt-4 text-sm rounded-lg hover:scale-[1.01] transition"
        >
          <Eraser className="w-5" />
          Remove Background
        </button>
      </form>

      {/* Right Column */}
      <div className="w-full md:w-1/2 p-6 bg-white rounded-xl  border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <Image className="w-5 h-5 text-[#ffc800]" />
          <h1 className="text-xl font-semibold">Processed Output</h1>
        </div>

        <div className="flex-1 flex justify-center items-center mt-10">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Image className="w-9 h-9" />
            <p>Upload an image and click "Remove Background" to get started</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveBackground;
