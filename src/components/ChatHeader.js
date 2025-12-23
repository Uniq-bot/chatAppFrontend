import { X } from "lucide-react";
import useAuth from "@/libs/useAuth";
import { useChatMessage } from "@/libs/useChatMessage";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatMessage();
  const { onlineUsers } = useAuth();
  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.pic || "/avatar.png"} alt={selectedUser.name} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.name}</h3>
            {/* <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p> */}
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;