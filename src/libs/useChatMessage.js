import { create } from "zustand";
import { axiosInstance } from "./axios";
import toast from "react-hot-toast";

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
    const res= await axiosInstance.post(`/sendMessage/${selectedUser._id}`,data);
    const newMessage= res.data;
    set({messages:[...messages, newMessage]});
    
    
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Failed to send message");
  }
 

},

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },
}));
