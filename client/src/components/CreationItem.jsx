import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import Markdown from 'react-markdown';

const CreationItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className={`${
        expanded ? 'h-auto' : 'h-20'
      } flex flex-col justify-between gap-4 overflow-hidden w-full text-sm bg-white border border-gray-200 rounded-lg cursor-pointer transition-all duration-300`}
    >
      <div className="flex justify-between items-start gap-4 p-4">
        <div>
          <h2 className="font-medium">{item.prompt}</h2>
          <p className="text-gray-500">
            {item.type} - {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] px-4 py-1 rounded-full">
            {item.type}
          </button>
          <ChevronDown
            className={`transform scale-[0.7] transition-transform duration-300 ${
              expanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {expanded && (
        <div className="p-4 pt-0">
          {item.type === 'image' ? (
            <img
              src={item.content}
              alt="Generated"
              className="w-full h-auto rounded-lg"
            />
          ) : (
            <Markdown>{item.content || '_No content available_'}</Markdown>
          )}
        </div>
      )}
    </div>
  );
};

export default CreationItem;
