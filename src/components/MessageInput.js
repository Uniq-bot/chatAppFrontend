import { useChatMessage } from '@/libs/useChatMessage';
import { Send, Image } from 'lucide-react';
import React, { useRef, useState } from 'react'

const MessageInput = () => {
    const [text, setText]=useState('');
    const [ImagePreview, setImagePreview]=useState(null);
    const fileInputRef= useRef(null)
    const {sendMessages}=useChatMessage();
   const handleImageChange=(e)=>{};
   const removeImage=()=>{
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
   };
   const handleSendMessage =async(e)=>{
    e.preventDefault();
   };


  return (
    <div className='w-full p-4'>
        {
            ImagePreview && (
                <div className='mb-4 relative'>
                    <img src={ImagePreview} alt="Preview" className='max-h-48 rounded-md'/>
                    <button
                    onClick={removeImage}
                    className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-sm'
                    >
                        X
                    </button>
                </div>
            )

        }
       <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${ImagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !ImagePreview}
        >
          <Send size={22} />
        </button>
      </form>


      
    </div>
  )
}

export default MessageInput
