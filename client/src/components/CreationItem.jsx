import {  ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import Markdown from 'react-markdown';

const CreationItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="p-4 w-full text-sm bg-white border border-gray-200 rounded-lg cursor-pointer transition-all duration-300"
    >
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="font-medium">{item.prompt}</h2>
          <p className="text-gray-500">
            {item.type} - {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>


        <div className='flex items-center gap-2'>
            <button className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] px-4 py-1 rounded-full">
          {item.type}
        </button>
        {expanded ? <ChevronDown className='scale-[0.7]'/> : <ChevronDown className="transform rotate-180 scale-[0.7]" />}
        </div>
      </div>

      {expanded && (
        <div className="mt-4">
          {item.type === 'image' ? (
            <img
              src={item.content}
              alt="Generated"
              className="w-full h-auto rounded-lg"
            />
          ) : (
            <Markdown>{item.content}</Markdown>
          )}
        </div>
      )
    }
    </div>
  );
};

export default CreationItem;
