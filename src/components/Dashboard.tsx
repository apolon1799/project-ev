import React from 'react';
import { useCollaborativeSession } from '../hooks/useCollaborativeSession';
import UserList from './UserList';
import SharedCounter from './SharedCounter';
import Chat from './Chat';
import { Users, MessageSquare, Hash, Zap, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const {
    users,
    messages,
    counter,
    currentUser,
    sendMessage,
    deleteMessage,
    updateCounter,
    markTyping
  } = useCollaborativeSession();

  const handleResetCounter = () => {
    updateCounter(-counter.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              CollabSync
            </h1>
          </div>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Real-time collaboration dashboard that synchronizes across all browser tabs
          </p>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white">
            <div
              className="w-4 h-4 rounded-full animate-pulse"
              style={{ backgroundColor: currentUser.color }}
            />
            <span className="font-medium">Connected as: {currentUser.name}</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">
                  {users.length}
                </div>
                <div className="text-purple-200 font-medium">Active Users</div>
              </div>
            </div>
          </div>

          <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">
                  {messages.length}
                </div>
                <div className="text-purple-200 font-medium">Messages</div>
              </div>
            </div>
          </div>

          <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Hash className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">
                  {counter.value}
                </div>
                <div className="text-purple-200 font-medium">Counter Value</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
          {/* User List */}
          <div className="xl:col-span-1">
            <UserList users={users} currentUserId={currentUser.id} />
          </div>

          {/* Counter */}
          <div className="xl:col-span-1">
            <SharedCounter
              counter={counter}
              onUpdate={updateCounter}
              onReset={handleResetCounter}
            />
          </div>

          {/* Chat */}
          <div className="xl:col-span-1">
            <Chat
              messages={messages}
              users={users}
              currentUserId={currentUser.id}
              onSendMessage={sendMessage}
              onDeleteMessage={deleteMessage}
              onMarkTyping={markTyping}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              How to Test Real-time Sync
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-purple-200">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>Open this page in multiple browser tabs to see real-time synchronization</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>Try updating the counter in one tab and watch it sync to others</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>Send messages and see them appear instantly in all tabs</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>Watch the user list update as tabs are opened and closed</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>Try the typing indicators by typing in the chat</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>Test message expiration by setting a short expiry time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
