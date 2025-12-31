import React from 'react'
import { MessageSquare } from "lucide-react";

const NoChatSkeleton = () => {

  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-4 sm:p-8 md:p-16 bg-base-100/50 order-1 md:order-2">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-12 sm:w-16 h-12 sm:h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce"
            >
              <MessageSquare className="w-6 sm:w-8 h-6 sm:h-8 text-primary " />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-xl sm:text-2xl font-bold">Welcome to Chatty!</h2>
        <p className="text-sm sm:text-base text-base-content/60">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};


export default NoChatSkeleton
