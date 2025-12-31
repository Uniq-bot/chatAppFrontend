import { useEffect, useState } from "react";
import { useChatMessage } from "@/libs/useChatMessage";
import useAuth from "@/libs/useAuth";
import SidebarSkeleton from "./Skeletons/SideBarSkeleton";
import { Users, UsersRound } from "lucide-react";
import { axiosInstance } from "@/libs/axios";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { selectedUser, setSelectedUser, selectedGroup, setSelectedGroup } = useChatMessage();
  
  const { onlineUsers, contacts } = useAuth();

  const [activeView, setActiveView] = useState("contacts"); // 'contacts' or 'groups'
  const [groups, setGroups] = useState([]);
  const [isGroupsLoading, setIsGroupsLoading] = useState(false);

  

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
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error(error.response?.data?.message || "Failed to fetch groups");
    } finally {
      setIsGroupsLoading(false);
    }
  };

  const onlineIds = Array.isArray(onlineUsers) ? onlineUsers : [];

  if (isGroupsLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-full md:w-64 lg:w-72 xl:w-80 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-3 sm:p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-3 md:mb-4">
          {activeView === "contacts" ? (
            <Users className="size-5 md:size-6" />
          ) : (
            <UsersRound className="size-5 md:size-6" />
          )}
          <span className="font-medium text-sm md:text-base">
            {activeView === "contacts" ? "Contacts" : "Groups"}
          </span>
        </div>

        {/* Toggle buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView("contacts")}
            className={`flex-1 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              activeView === "contacts"
                ? "bg-base-300 text-white"
                : "bg-base-100 text-zinc-400 hover:bg-base-200"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Users className="size-4" />
              <span className="hidden sm:inline">Contacts</span>
            </span>
          </button>
          <button
            onClick={() => setActiveView("groups")}
            className={`flex-1 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              activeView === "groups"
                ? "bg-base-300 text-white"
                : "bg-base-100 text-zinc-400 hover:bg-base-200"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <UsersRound className="size-4" />
              <span className="hidden sm:inline">Groups</span>
            </span>
          </button>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-2 px-2 space-y-1 flex-1">
        {activeView === "contacts" ? (
          <>
            {contacts.map((user) => (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`
                  w-full p-2 sm:p-3 flex items-center gap-3
                  hover:bg-base-300 transition-colors rounded-lg
                  ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
                `}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={user.pic || "/avatar.png"}
                    alt={user.name}
                    className="size-10 sm:size-12 object-cover rounded-full"
                  />
                  {onlineIds.includes(user._id) && (
                    <span
                      className="absolute bottom-0 right-0 size-2.5 sm:size-3 bg-green-500 
                      rounded-full ring-2 ring-zinc-900"
                    />
                  )}
                </div>

                {/* User info */}
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium truncate text-sm sm:text-base">{user.name}</div>
                  <div className="text-xs sm:text-sm text-zinc-400">
                    {onlineIds.includes(user._id) ? "Online" : "Offline"}
                  </div>
                </div>
              </button>
            ))}

            {contacts.length === 0 && (
              <div className="text-center text-zinc-500 py-6 px-4 text-sm">
                <p className="mb-2">No contacts yet</p>
                <p className="text-xs">Search for users to start chatting</p>
              </div>
            )}
          </>
        ) : (
          <>
            {groups.map((group) => (
              <button
                key={group._id}
                onClick={() => setSelectedGroup(group)}
                className={`
                  w-full p-2 sm:p-3 flex items-center gap-3
                  hover:bg-base-300 transition-colors rounded-lg
                  ${selectedGroup?._id === group._id ? "bg-base-300 ring-1 ring-base-300" : ""}
                `}
              >
                <div className="relative flex-shrink-0">
                  <div className="size-10 sm:size-12 rounded-full bg-base-300 flex items-center justify-center">
                    {
                      group.image ? (
                        <img
                          src={group.image}
                          alt={group.name}
                          className="size-10 sm:size-12 object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-zinc-400 font-bold">
                         <Users className="size-5 sm:size-6" />
                        </span>
                      )
                    }
                  </div>
                </div>

                {/* Group info */}
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium truncate text-sm sm:text-base">{group.name}</div>
                  <div className="text-xs sm:text-sm text-zinc-400">
                    {group.admin?.name ? `Admin: ${group.admin.name}` : "Group"}
                  </div>
                </div>
              </button>
            ))}

            {groups.length === 0 && (
              <div className="text-center text-zinc-500 py-6 px-4 text-sm">No groups found</div>
            )}
          </>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;