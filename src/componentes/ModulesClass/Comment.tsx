import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { Comment } from "@/componentes/types/interface";

export const CommentComponent = ({ comment }: { comment: Comment }) => {
  return (
    <div className="flex space-x-3">
      <Avatar className="w-7 h-7 flex-shrink-0 ">
        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-xs text-white">
          {comment.avatar}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 ">
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-white ">
                {comment.user}
              </span>
              <span className="text-xs text-gray-400">
                {comment.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <p className="text-xs text-gray-300 ">{comment.message}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
