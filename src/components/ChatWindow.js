"use client";
import { useChatMessage } from "@/libs/useChatMessage";
import React, { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./Skeletons/MessageSkeleton";
import useAuth from "@/libs/useAuth";
import { formatMessageTime } from "@/libs/utils.js";

const ChatWindow = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, messageListener } =
    useChatMessage();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
      messageListener();
    }
  }, [selectedUser, getMessages, messageListener]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex flex-col w-full">
        <ChatHeader />
        <MessageSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-hidden">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6 space-y-3 sm:space-y-4">
        {messages.map((message) => (
          <div key={message._id} className={`chat ${message.senderId._id === user?._id ? 'chat-end' : 'chat-start'}`}>
            <div className="chat-image avatar">
              <div className="size-8 sm:size-9 md:size-10 rounded-full border">
                <img src={message.senderId._id === user?._id ? user.pic || '/avatar.png' : selectedUser.pic || '/avatar.png'} alt="pfp" />
              </div>
            </div>
            <div className="chat-header mb-1 flex gap-1 sm:gap-2 flex-wrap items-center">
              <span className="text-xs font-semibold">
                {message.senderId._id === user?._id ? "You" : selectedUser.name}
              </span>
              <time className="text-xs opacity-50">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col text-sm max-w-[85%] sm:max-w-xs md:max-w-sm lg:max-w-md">
              {message.message && <p className="break-words whitespace-pre-wrap">{message.message}</p>}
              {message.image && <img src={message.image} alt="message image" className="max-w-full rounded mt-2" />}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput isGroup={false} />
    </div>
  );
};

export default ChatWindow;
