import { UserRound, X } from "lucide-react";
import useAuth from "@/libs/useAuth";
import { useChatMessage } from "@/libs/useChatMessage";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, selectedGroup, setSelectedGroup } = useChatMessage();
  const { onlineUsers } = useAuth();
  
  const current = selectedUser || selectedGroup;
  const isGroup = !!selectedGroup;

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              {
                isGroup ? (
                  current?.image ? (
                    <img src={current.image} alt="Group Avatar" />
                  ) : (
                    <UserRound className="size-10" />
                  )
                ) : (
                  <img src={current?.pic || '/avatar.png'} alt="User Avatar" />
                )
              }
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{current?.name}</h3>
            {!isGroup && (
              <p className="text-sm text-base-content/70">
                {onlineUsers?.includes(selectedUser?._id) ? "Online" : "Offline"}
              </p>
            )}
            {isGroup && (
              <p className="text-sm text-base-content/70">
                {current?.admin?.name ? `Admin: ${current.admin.name}` : "Group"}
              </p>
            )}
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => {
          if (isGroup) {
            setSelectedGroup(null);
          } else {
            setSelectedUser(null);
          }
        }}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;