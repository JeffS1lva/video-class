import { Button } from "@/components/ui/button";
import { MessageCircle, PlayCircle } from "lucide-react";
import React from "react";

export const TabHeader = ({ 
  activeTab, 
  onTabChange 
}: {
  activeTab: 'lessons' | 'chat';
  onTabChange: (tab: 'lessons' | 'chat') => void;
}) => {
  return (
    <div className="border-b border-white/10">
      <div className="flex">
        {/* Tab Aulas */}
        <Button
          onClick={() => onTabChange('lessons')}
          variant="ghost"
          className={`flex-1 rounded-none h-12 sm:h-14 transition-all duration-200 relative ${
            activeTab === 'lessons'
              ? 'text-white bg-purple-500/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <div className="flex items-center space-x-1 sm:space-x-2">
            <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base font-medium">Aulas</span>
          </div>
          {activeTab === 'lessons' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500" />
          )}
        </Button>

        {/* Tab Chat */}
        <Button
          onClick={() => onTabChange('chat')}
          variant="ghost"
          className={`flex-1 rounded-none h-12 sm:h-14 transition-all duration-200 relative ${
            activeTab === 'chat'
              ? 'text-white bg-purple-500/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <div className="flex items-center space-x-1 sm:space-x-2">
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base font-medium">Chat</span>
          </div>
          {activeTab === 'chat' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500" />
          )}
        </Button>
      </div>
    </div>
  );
};

