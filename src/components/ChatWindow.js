"use client";
import { useChatMessage } from "@/libs/useChatMessage";
import React, { useEffect } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./Skeletons/MessageSkeleton";
import useAuth from "@/libs/useAuth";
import { formatMessageTime } from "@/libs/utils.js";

const ChatWindow = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, messageListener } =
    useChatMessage();
    const {user}=useAuth()
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
      messageListener();
    }
  }, [selectedUser, getMessages, messageListener]);
  if (isMessagesLoading) {
    return (
      <div className="flex flex-col w-full">
        <ChatHeader />
        <MessageSkeleton />
      </div>
    );
  }
  return (
    <div className="w-full h-full flex flex-col justify-between overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message._id} className={`chat ${message.senderId===user?._id ? 'chat-end' : 'chat-start'}`}>
             <div className="chat-image avatar">
               <div className="size-10 rounded-full border">
                <img src={message.senderId===user?._id ? user.pic || '/avatar.png' : selectedUser.pic || '/avatar.png'} alt="pfp" />
                
                </div>
             </div>
               <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.message && <p>{message.message}</p>}
            </div>
            </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatWindow;
