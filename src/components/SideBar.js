import { useEffect, useState } from "react";
import { useChatMessage } from "@/libs/useChatMessage";
import useAuth from "@/libs/useAuth";
import SidebarSkeleton from "./Skeletons/SideBarSkeleton";
import { Users, UsersRound } from "lucide-react";
import { axiosInstance } from "@/libs/axios";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, selectedGroup, setSelectedGroup, isUsersLoading } = useChatMessage();

  const { onlineUsers } = useAuth();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [activeView, setActiveView] = useState("contacts"); // 'contacts' or 'groups'
  const [groups, setGroups] = useState([]);
  const [isGroupsLoading, setIsGroupsLoading] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    if (activeView === "groups") {
      fetchGroups();

    }
  }, [activeView]);

  const fetchGroups = async () => {
    setIsGroupsLoading(true);
    try {
      const res = await axiosInstance.get("/groups/all");
      const currentUserId = useAuth.getState().user._id;
      
      const joinedGroups = res.data.groups.filter(group => 
        group.members && group.members.some(member => 
          (typeof member === 'string' ? member : member._id) === currentUserId
        )
      );
      setGroups(joinedGroups); 
      console.log("Joined groups:", joinedGroups);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch groups");
    } finally {
      setIsGroupsLoading(false);
    }
  };

  const onlineIds = Array.isArray(onlineUsers) ? onlineUsers : [];
  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineIds.includes(user._id))
    : users;

  if (isUsersLoading || isGroupsLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2 mb-4">
          {activeView === "contacts" ? (
            <Users className="size-6" />
          ) : (
            <UsersRound className="size-6" />
          )}
          <span className="font-medium hidden lg:block">
            {activeView === "contacts" ? "Contacts" : "Groups"}
          </span>
        </div>

        {/* Toggle buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView("contacts")}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === "contacts"
                ? "bg-base-300 text-white"
                : "bg-base-100 text-zinc-400 hover:bg-base-200"
            }`}
          >
            <Users className="size-4 mx-auto lg:hidden" />
            <span className="hidden lg:block">Contacts</span>
          </button>
          <button
            onClick={() => setActiveView("groups")}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === "groups"
                ? "bg-base-300 text-white"
                : "bg-base-100 text-zinc-400 hover:bg-base-200"
            }`}
          >
            <UsersRound className="size-4 mx-auto lg:hidden" />
            <span className="hidden lg:block">Groups</span>
          </button>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {activeView === "contacts" ? (
          <>
            {filteredUsers.map((user) => (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`
                  w-full p-3 flex items-center gap-3
                  hover:bg-base-300 transition-colors
                  ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
                `}
              >
                <div className="relative mx-auto lg:mx-0">
                  <img
                    src={user.pic || "/avatar.png"}
                    alt={user.name}
                    className="size-12 object-cover rounded-full"
                  />
                  {onlineIds.includes(user._id) && (
                    <span
                      className="absolute bottom-0 right-0 size-3 bg-green-500 
                      rounded-full ring-2 ring-zinc-900"
                    />
                  )}
                </div>

                {/* User info - only visible on larger screens */}
                <div className="hidden lg:block text-left min-w-0">
                  <div className="font-medium truncate">{user.name}</div>
                  <div className="text-sm text-zinc-400">
                    {onlineIds.includes(user._id) ? "Online" : "Offline"}
                  </div>
                </div>
              </button>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center text-zinc-500 py-4">No online users</div>
            )}
          </>
        ) : (
          <>
            {groups.map((group) => (
              <button
                key={group._id}
                onClick={() => setSelectedGroup(group)}
                className={`
                  w-full p-3 flex items-center gap-3
                  hover:bg-base-300 transition-colors
                  ${selectedGroup?._id === group._id ? "bg-base-300 ring-1 ring-base-300" : ""}
                `}
              >
                <div className="relative mx-auto lg:mx-0">
                  <div className="size-12 rounded-full bg-base-300 flex items-center justify-center">
                    {
                      group.image ? (
                        <img
                          src={group.image}
                          alt={group.name}
                          className="size-12 object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-zinc-400 font-bold text-xl">
                         <Users className="size-6" />
                        </span>
                      )
                    }
                  </div>
                </div>

                {/* Group info - only visible on larger screens */}
                <div className="hidden lg:block text-left min-w-0">
                  <div className="font-medium truncate">{group.name}</div>
                  <div className="text-sm text-zinc-400">
                    {group.admin?.name ? `Admin: ${group.admin.name}` : "Group"}
                  </div>
                </div>
              </button>
            ))}

            {groups.length === 0 && (
              <div className="text-center text-zinc-500 py-4">No groups found</div>
            )}
          </>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;