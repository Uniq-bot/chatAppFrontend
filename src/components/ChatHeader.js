import { UserRound, X } from "lucide-react";
import useAuth from "@/libs/useAuth";
import { useChatMessage } from "@/libs/useChatMessage";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, selectedGroup, setSelectedGroup } = useChatMessage();
  const { onlineUsers } = useAuth();
  
  const current = selectedUser || selectedGroup;
  const isGroup = !!selectedGroup;

  return (
    <div className="p-3 sm:p-4 border-b border-base-300 bg-base-100">
      <div className="flex items-center justify-between gap-3 pl-8 md:pl-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Avatar */}
          <div className="avatar flex-shrink-0">
            <div className="size-9 sm:size-10 md:size-11 rounded-full relative">
              {
                isGroup ? (
                  current?.image ? (
                    <img src={current.image} alt="Group Avatar" className="rounded-full" />
                  ) : (
                    <div className="bg-base-300 rounded-full flex items-center justify-center w-full h-full">
                      <UserRound className="size-5 sm:size-6" />
                    </div>
                  )
                ) : (
                  <img src={current?.pic || '/avatar.png'} alt="User Avatar" className="rounded-full" />
                )
              }
            </div>
          </div>

          {/* User info */}
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-sm sm:text-base truncate">{current?.name}</h3>
            {!isGroup && (
              <p className="text-xs sm:text-sm text-base-content/70">
                {onlineUsers?.includes(selectedUser?._id) ? (
                  <span className="text-green-500">● Online</span>
                ) : (
                  "Offline"
                )}
              </p>
            )}
            {isGroup && (
              <p className="text-xs sm:text-sm text-base-content/70 truncate">
                {current?.admin?.name ? `Admin: ${current.admin.name}` : "Group"}
              </p>
            )}
          </div>
        </div>

        {/* Close button - hidden on mobile as we use back arrow */}
        <button 
          onClick={() => {
            if (isGroup) {
              setSelectedGroup(null);
            } else {
              setSelectedUser(null);
            }
          }} 
          className="hidden md:flex flex-shrink-0 btn btn-ghost btn-sm btn-circle"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;