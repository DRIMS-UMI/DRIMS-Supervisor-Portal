import React from 'react';
import { RiArrowDownSLine } from 'react-icons/ri';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DashboardDirectMessages = ({ messages, isLoading, unreadCount = 0, onViewMore }) => {
  return (
    <Card className="flex flex-col h-full shadow-sm rounded-lg border-0 bg-white">
      <CardHeader className="flex flex-row justify-between items-start gap-6 space-y-0 py-5">
        <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
          Direct Messages
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#23388F] text-white text-xs font-medium">
              {unreadCount}
            </span>
          )}
        </CardTitle>
        <Button 
          onClick={onViewMore}
          className="text-sm text-white bg-[#23388F] hover:bg-[#23388F]/80 flex items-center gap-1 px-3 py-1.5 rounded"
        >
          View More <RiArrowDownSLine className="text-white w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-0">
        <div className="flex-1 space-y-2">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-3 py-2 border-b last:border-b-0 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
        ) : messages && messages.length > 0 ? (
          // Actual messages
          messages.map((msg, idx) => (
            <div key={idx} className={`flex items-center gap-3 py-2 border-b last:border-b-0 ${msg.isUnread ? 'bg-blue-50/50 rounded-lg px-2' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-base ${msg.color}`}>
                {msg.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <div className={`text-xs ${msg.isUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-900'}`}>{msg.sender}</div>
                  {msg.isUnread && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>}
                </div>
                <div className={`text-xs truncate max-w-[180px] ${msg.isUnread ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>{msg.message}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {msg.isUnread && msg.unreadCount > 1 && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-5 px-1.5 rounded-full bg-[#23388F] text-white text-[10px] font-medium">
                    {msg.unreadCount}
                  </span>
                )}
                <div className="text-xs text-gray-400 whitespace-nowrap">{msg.time}</div>
              </div>
            </div>
          ))
        ) : (
          // Empty state
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <div className="text-sm font-medium">No recent messages</div>
            <div className="text-xs text-gray-400 mt-1">Messages will appear here when you receive them</div>
          </div>
        )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardDirectMessages;