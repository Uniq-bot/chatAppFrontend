import { useChatMessage } from '@/libs/useChatMessage';
import { Send, Image } from 'lucide-react';
import React, { useRef, useState } from 'react'

const MessageInput = ({ isGroup = false }) => {
    const [text, setText] = useState('');
    const { sendMessages, sendGroupMessage } = useChatMessage();

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim()) {
            return;
        }
        try {
            if (isGroup) {
                await sendGroupMessage({ content: text });
            } else {
                await sendMessages({ message: text });
            }
            setText('');
        } catch (error) {
            console.log('sent message error: ', error)
        }
    };

    return (
        <div className='w-full p-4'>
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <div className="flex-1 flex gap-2">
                    <input
                        type="text"
                        className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                        placeholder="Type a message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-sm btn-circle"
                    disabled={!text.trim()}
                >
                    <Send size={22} />
                </button>
            </form>
        </div>
    )
}

export default MessageInput
