"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { axiosInstance } from "@/libs/axios";
import toast from "react-hot-toast";
import { 
  Search, 
  Users, 
  MessageSquare, 
  Loader2, 
  UserPlus,
  Sparkles
} from "lucide-react";
import AuthImagePattern from "@/components/AuthPattern";
import useAuth from "@/libs/useAuth";

const JoinGroup = () => {
  const router = useRouter();
  const { user, fetchGroups } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningGroupId, setJoiningGroupId] = useState(null);



  // Filter groups when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredGroups(groups);
    } else {
      const filtered = groups.filter((group) =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredGroups(filtered);
    }
  }, [searchQuery, groups]);

  useEffect(() => {
    const loadGroups = async () => {
      setLoading(true);
      try {
        const allGroups = await fetchGroups();
        if (allGroups)
        setGroups(allGroups);
        setFilteredGroups(allGroups);
      } catch (error) {
        toast.error("Failed to fetch groups");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, [fetchGroups]);

  const handleJoinGroup = async (groupId) => {
    try {
      setJoiningGroupId(groupId);
      const response = await axiosInstance.post(`/auth/joinGroup/${groupId}`);
      toast.success(response.data.message || "Joined group successfully!");
      
      // Remove the joined group from the list
      setGroups(groups.filter(g => g._id !== groupId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join group");
      console.error(error);
    } finally {
      setJoiningGroupId(null);
    }
  };

  const isAlreadyMember = (group) => {
    return group.members?.includes(user?._id);
  };

  return (
    <div className="min-h-[90vh] w-full grid lg:grid-cols-1 bg-base-200">
      {/* Left Side - Groups List */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-16 rounded-2xl bg-primary
                flex items-center justify-center group-hover:scale-105 transition-all duration-300 
                shadow-lg"
              >
                <Users className="size-8 text-primary-content" />
              </div>
              <h1 className="text-3xl font-bold mt-4 text-primary">
                Join a Group
              </h1>
              <p className="text-base-content/70 text-sm">
                Discover and join groups to start conversations
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-12 focus:input-primary"
                  placeholder="Search groups by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Groups List */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="size-8 animate-spin text-primary mb-4" />
                  <p className="text-base-content/60">Loading groups...</p>
                </div>
              ) : filteredGroups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Users className="size-16 text-base-content/20 mb-4" />
                  <p className="text-base-content/60 text-center">
                    {searchQuery ? "No groups found matching your search" : "No groups available"}
                  </p>
                  <button
                    onClick={() => router.push("/pages/createGroup")}
                    className="btn btn-primary btn-sm mt-4 gap-2"
                  >
                    <Sparkles className="size-4" />
                    Create New Group
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {filteredGroups.map((group) => (
                    <div
                      key={group._id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-base-300 
                        hover:border-primary/50 hover:bg-base-200 transition-all"
                    >
                      {/* Group Avatar */}
                      <div className="avatar">
                        <div className="w-14 h-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                          {group.image ? (
                            <Image
                              src={group.image}
                              alt={group.name}
                              width={56}
                              height={56}
                              className="object-cover rounded-full"
                            />
                          ) : (
                            <div className="flex items-center justify-center bg-gradient-to-br 
                              from-primary/20 to-secondary/20 w-full h-full">
                              <Users className="size-6 text-primary" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Group Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base truncate">
                          {group.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-base-content/60">
                          <Users className="size-3" />
                          <span>{group.members?.length || 0} members</span>
                        </div>
                      </div>

                      {/* Join Button */}
                      <button
                        onClick={() => handleJoinGroup(group._id)}
                        disabled={joiningGroupId === group._id || isAlreadyMember(group)}
                        className="btn btn-primary btn-sm gap-2"
                      >
                        {joiningGroupId === group._id ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Joining...
                          </>
                        ) : isAlreadyMember(group) ? (
                          "Joined"
                        ) : (
                          <>
                            <UserPlus className="size-4" />
                            Join
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <div className="divider text-xs text-base-content/40">OR</div>
            <p className="text-base-content/70 text-sm">
              Want to create your own group?{" "}
              <button
                onClick={() => router.push("/pages/createGroup")}
                className="link link-primary font-semibold hover:link-secondary"
              >
                Create Group →
              </button>
            </p>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default JoinGroup;