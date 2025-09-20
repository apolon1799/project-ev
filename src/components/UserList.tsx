import React from 'react';
import type { User } from '../hooks/useCollaborativeSession';
import { Users, Activity, Wifi, WifiOff } from 'lucide-react';

interface UserListProps {
  users: User[];
  currentUserId: string;
}

const UserList: React.FC<UserListProps> = ({ users, currentUserId }) => {
  const formatLastActivity = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (a.id === currentUserId) return -1;
    if (b.id === currentUserId) return 1;
    
    return b.lastActivity - a.lastActivity;
  });

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
          <Users className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white">
          Active Users
        </h3>
        <div className="ml-auto px-3 py-1 bg-white/20 rounded-full">
          <span className="text-white font-semibold">{users.length}</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {sortedUsers.map((user) => (
          <div
            key={user.id}
            className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
              user.id === currentUserId 
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 shadow-lg shadow-purple-500/10' 
                : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
            }`}
          >
            <div className="relative">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${user.color}, ${user.color}CC)`,
                  boxShadow: `0 0 20px ${user.color}40`
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                  user.isTyping ? 'bg-green-500' : 'bg-gray-400'
                }`}
              >
                {user.isTyping ? (
                  <Activity className="w-2 h-2 text-white animate-pulse" />
                ) : (
                  <Wifi className="w-2 h-2 text-white" />
                )}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-bold text-white text-lg truncate">
                  {user.name}
                  {user.id === currentUserId && (
                    <span className="text-purple-300 text-sm ml-2 font-normal">(You)</span>
                  )}
                </span>
                {user.isTyping && (
                  <div className="flex items-center gap-1 text-green-400 text-sm font-medium">
                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    <span className="ml-1">typing</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-purple-200 text-sm">
                <WifiOff className="w-3 h-3" />
                <span>Last active: {formatLastActivity(user.lastActivity)}</span>
              </div>
            </div>
          </div>
        ))}
        
        {users.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white/50" />
            </div>
            <div className="text-white/60 text-lg">No active users</div>
            <div className="text-white/40 text-sm mt-1">Open more tabs to see collaboration</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
