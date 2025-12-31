"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/libs/useAuth";
import { LoaderPinwheel, ArrowLeft } from "lucide-react";
import { useChatMessage } from "@/libs/useChatMessage";
import SideBar from "@/components/SideBar";
import NoChatSkeleton from "@/components/NoChatSkeleton";
import ChatWindow from "@/components/ChatWindow";
import GroupChatWindow from "@/components/GroupChatWindow";

const Home = () => {
  const router = useRouter();
  const { isAuthenticated, loading, checkAuth } = useAuth();
  const { selectedUser, selectedGroup } = useChatMessage();
  const [showSidebar, setShowSidebar] = useState(true);
  
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/pages/Login");
    } else if (!loading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, loading, router]);

  // Hide sidebar when chat is selected on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      } else {
        setShowSidebar(!(selectedUser || selectedGroup));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedUser, selectedGroup]);

  const handleBackToSidebar = () => {
    setShowSidebar(true);
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <LoaderPinwheel className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] w-full bg-base-200 md:p-2 lg:p-4 xl:p-6">
      <div className="flex w-full h-full items-center justify-center">
        <div className="bg-base-100 md:rounded-xl md:shadow-xl w-full h-full max-w-7xl">
          <div className="flex w-full h-full md:rounded-xl overflow-hidden relative">
            {/* Sidebar - hidden on mobile when chat is active */}
            <div
              className={`${
                showSidebar ? "flex" : "hidden"
              } md:flex w-full md:w-auto`}
            >
              <SideBar />
            </div>

            {/* Chat Area - full width on mobile */}
            <div
              className={`${
                showSidebar ? "hidden md:flex" : "flex"
              } flex-1 w-full relative flex-col`}
            >
              {/* Back button for mobile */}
              {(selectedUser || selectedGroup) && (
                <button
                  onClick={handleBackToSidebar}
                  className="md:hidden absolute top-3 left-3 z-10 btn btn-circle btn-sm bg-base-200/80 backdrop-blur-sm"
                  aria-label="Back to chats"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}

              {!selectedUser && !selectedGroup ? (
                <NoChatSkeleton />
              ) : selectedGroup ? (
                <GroupChatWindow />
              ) : (
                <ChatWindow />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;