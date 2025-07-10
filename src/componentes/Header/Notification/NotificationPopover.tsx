import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

interface NotificationPopoverProps {
  notifications: number;
  notificationItems: NotificationItem[];
}

export const NotificationPopover = ({
  notifications,
  notificationItems,
}: NotificationPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2 sm:p-2.5 rounded-xl hover:bg-white/10 transition-all duration-300 group"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-yellow-300 transition-colors duration-300" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse ring-2 ring-black/20">
              {notifications > 9 ? "9+" : notifications}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 sm:w-80 p-0 bg-black/95 backdrop-blur-xl border-white/10 shadow-2xl"
        align="end"
        sideOffset={10}
      >
        <div className="p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-white text-sm sm:text-base">Notificações</h4>
            <Badge
              variant="secondary"
              className="bg-white/10 text-white text-xs"
            >
              {notifications} nova{notifications !== 1 ? "s" : ""}
            </Badge>
          </div>
          <Separator className="bg-white/10" />
        </div>
        <div className="max-h-72 sm:max-h-80 overflow-y-auto">
          {notificationItems.map((item, index) => (
            <div key={item.id}>
              <div className="p-2 sm:p-3 hover:bg-white/5 transition-colors cursor-pointer">
                <div className="flex items-start space-x-2 sm:space-x-3 hover:bg-zinc-700 rounded-sm p-1.5 transition-colors">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      item.unread ? "bg-blue-500" : "bg-gray-600"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-white truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                      {item.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {item.time}
                    </p>
                  </div>
                </div>
              </div>
              {index < notificationItems.length - 1 && (
                <Separator className="bg-white/5" />
              )}
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-white/10">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs sm:text-sm text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            Ver todas as notificações
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};