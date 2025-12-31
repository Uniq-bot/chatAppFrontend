import React from 'react'
import { MessageSquare } from "lucide-react";

const NoChatSkeleton = () => {

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 lg:p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-4 sm:space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="relative">
            <div
              className="w-14 sm:w-16 md:w-20 h-14 sm:h-16 md:h-20 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce"
            >
              <MessageSquare className="w-7 sm:w-8 md:w-10 h-7 sm:h-8 md:h-10 text-primary" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Welcome to Chatty!</h2>
        <p className="text-sm sm:text-base text-base-content/60 px-4">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};


export default NoChatSkeleton
