import { create } from "zustand";
import { axiosInstance } from "./axios";
import toast from "react-hot-toast";
import useAuth from "./useAuth";

export const useChatMessage = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/users");
      set({ users: res.data.users });
      console.log(res.data.users)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },
getMessages: async (userId) => {
  set({ isMessagesLoading: true, messages: [] });

  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("Not authenticated");
    set({ isMessagesLoading: false });
    return;
  }

  try {
    const res = await axiosInstance.get(`/messages/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    set({ messages: res.data.messages });
    console.log(res.data.messages)
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Failed to fetch messages");
  } finally {
    set({ isMessagesLoading: false });
  }
},
sendMessages:async(data)=>{
  const {messages, selectedUser}= get();
  try {
    const res= await axiosInstance.post(`/sendMessage/${selectedUser._id}`,{text: data.message});
    const newMessage= res.data.newMessage;
    set({messages:[...messages, newMessage]});
    console.log('Message sent successfully:', newMessage);
    
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Failed to send message");
  }
 

},
  messageListener: ()=>{
    const { selectedUser }= get();
    if(!selectedUser){
      return;
    }
    const socket = useAuth.getState().socket;
    if (!socket || !socket.connected) {
      console.log("Socket not connected, waiting...");
      setTimeout(() => {
        get().messageListener();
      }, 500);
      return;
    }
    // Prevent duplicate listeners when switching users
    socket.off("newMessage");
    socket.on("newMessage", (newMessage)=>{
      const { messages, selectedUser: currentSelected } = get();
      console.log("Received direct message:", newMessage);
      // Handle both populated (object) and non-populated (string) senderId
      const senderIdStr = typeof newMessage.senderId === 'string' ? newMessage.senderId : newMessage.senderId?._id;
      const receiverIdStr = typeof newMessage.receiver === 'string' ? newMessage.receiver : newMessage.receiver?._id;
      const currentSelectedId = currentSelected._id;
      
      // Check if message is FROM the selected user (receiver sent a message) or TO the selected user (any message in this conversation)
      if (currentSelected && (senderIdStr === currentSelectedId || receiverIdStr === currentSelectedId)) {
        set({ messages: [...messages, newMessage] });
      }
    });
  },
  groupMessageListener: ()=>{
    const { selectedGroup }= get();
    if(!selectedGroup){
      return;
    }
    const socket = useAuth.getState().socket;
    if (!socket || !socket.connected) {
      console.log("Socket not connected, waiting...");
      setTimeout(() => {
        get().groupMessageListener();
      }, 500);
      return;
    }
    
    // Emit joinGroup event to join the socket room
    socket.emit('joinGroup', selectedGroup._id);
    console.log(`Joining group ${selectedGroup._id}`);
    
    // Prevent duplicate listeners when switching groups
    socket.off("newGroupMessage");
    socket.on("newGroupMessage", (newMessage)=>{
      const { messages, selectedGroup: currentSelected } = get();
      console.log("Received group message:", newMessage);
      if (currentSelected && newMessage.groupId === currentSelected._id) {
        set({ messages: [...messages, newMessage] });
      }
    });
  },
  getGroupMessages: async (groupId)=>{
    set({ isMessagesLoading: true, messages: [] });

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Not authenticated");
      set({ isMessagesLoading: false });
      return;
    }
    try {
      const res = await axiosInstance.get(`/groupMessages/${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ messages: res.data.messages });
      console.log(res.data.messages)
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch group messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  selectedGroup: null,
  setSelectedGroup: (selectedGroup) => {
    set({ selectedGroup, selectedUser: null });
  },
  sendGroupMessage: async(data)=>{
    const {content}= data;
    const {messages, selectedGroup}=get();
    try {
      const res= await axiosInstance.post(`/sendGroupMessage/${selectedGroup._id}`,{content});
      const newMessage= res.data.newMessage;
      set({messages:[...messages, newMessage]});
      console.log('messages', messages);
      
    } catch (error) {

      console.log(error)
      
    }

  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser, selectedGroup: null });
  },
}));
