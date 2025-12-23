"use client";
import { useChatMessage } from '@/libs/useChatMessage'
import React, { useEffect } from 'react'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessageSkeleton from './Skeletons/MessageSkeleton';

const ChatWindow = () => {
  const {messages,  getMessages, isMessagesLoading, selectedUser}=useChatMessage()
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  },[selectedUser, getMessages])
  if(isMessagesLoading){
    return (
      <div className='flex flex-col w-full'>
      <ChatHeader />
      <MessageSkeleton />
      </div>
    )
  }
  return (
    <div className='w-full h-full flex flex-col justify-between overflow-auto'>
        <ChatHeader />
        <p>Messages</p>
        <MessageInput />
    </div>
  )
}

export default ChatWindow
