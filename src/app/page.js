"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/libs/useAuth";
import { Loader, LoaderPinwheel } from "lucide-react";
import { useChatMessage } from "@/libs/useChatMessage";
import SideBar from "@/components/SideBar";
import NoChatSkeleton from "@/components/NoChatSkeleton";
import ChatWindow from "@/components/ChatWindow";

const Home = () => {
  const router = useRouter();
  const { isAuthenticated, loading, checkAuth } = useAuth();
  const { selectedUser } = useChatMessage();
  useEffect(() => {
    checkAuth(); // validate token on page load
    
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/pages/Login"); // redirect only after loading is done
    }
    else if (!loading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, loading, router]);

  if (loading)
    return (
      <p className="w-full h-[90vh] absolute flex justify-center items-center">
        <LoaderPinwheel className="spin" />
      </p>
    );

  return (
    <div className=" h-[90vh] w-full bg-base-200 px-30">
      <div className="flex w-full h-full items-center justify-center py-10 px-4">
        <div className="bg-base-100 rounded-lg shadow-xl w-full  h-full">
          <div className="flex w-full h-full rounded-lg overflow-hidden">
            <SideBar />
            {
              !selectedUser ? <NoChatSkeleton /> : <ChatWindow />
            }
          </div>

        </div>

      </div>
     
    </div>
  );
};

export default Home;
