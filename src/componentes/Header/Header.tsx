import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Award,
  BookOpen,
  Bell,
  LogOut,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

export const PlatformHeader = ({
  completionRate = 75,
  userName = "João Silva",
  courseName = "Curso React Avançado",
  notifications = 3,
}: {
  completionRate?: number;
  userName?: string;
  courseName?: string;
  notifications?: number;
}) => {
  const notificationItems = [
    {
      id: 1,
      title: "Nova aula disponível",
      message: "Módulo 5: Hooks Avançados",
      time: "2 min atrás",
      unread: true,
    },
    {
      id: 2,
      title: "Certificado pronto",
      message: "Seu certificado está disponível",
      time: "1 hora atrás",
      unread: true,
    },
    {
      id: 3,
      title: "Feedback do instrutor",
      message: "Comentário no seu projeto",
      time: "3 horas atrás",
      unread: false,
    },
  ];

  return (
    <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="mx-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo e Informações do Curso - Lado Esquerdo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-white/10">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                EduPlatform
              </h1>
              <p className="text-sm text-gray-300 font-medium">{courseName}</p>
            </div>
          </div>

          {/* Ações do Usuário - Lado Direito */}
          <div className="flex items-center space-x-3">
            {/* Badge de Progresso */}
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-100 border-emerald-400/30 hover:from-emerald-500/30 hover:to-green-500/30 transition-all duration-300 px-3 py-1.5 font-semibold"
            >
              <Award className="w-4 h-4 mr-2 text-emerald-300" />
              {completionRate}% Completo
            </Badge>

            {/* Notificações com Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative p-2.5 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                >
                  <Bell className="w-5 h-5 text-white group-hover:text-yellow-300 transition-colors duration-300" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse ring-2 ring-black/20">
                      {notifications > 9 ? "9+" : notifications}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 p-0 bg-black/95 backdrop-blur-xl border-white/10 shadow-2xl"
                align="end"
                sideOffset={10}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white">Notificações</h4>
                    <Badge
                      variant="secondary"
                      className="bg-white/10 text-white text-xs"
                    >
                      {notifications} nova{notifications !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                  <Separator className="bg-white/10" />
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notificationItems.map((item, index) => (
                    <div key={item.id}>
                      <div className="p-3 hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="flex items-start space-x-3 hover:bg-zinc-700 rounded-sm p-1.5 transition-colors">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${
                              item.unread ? "bg-blue-500" : "bg-gray-600"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-300 mt-1">
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
                    className="w-full text-white hover:bg-white transition-colors cursor-pointer"
                  >
                    Ver todas as notificações
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Avatar do Usuário com Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative p-1 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                >
                  <Avatar className="h-9 w-9 ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300 shadow-lg">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-sm">
                      {userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black/50 shadow-sm" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 bg-black/95 backdrop-blur-xl border-white/10 shadow-2xl"
                align="end"
                sideOffset={10}
              >
                <DropdownMenuLabel className="pb-2">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white font-bold">
                        {userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {userName}
                      </p>
                      <p className="text-xs text-gray-300">Estudante Premium</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />

                <DropdownMenuSeparator className="bg-white/10" />

                <DropdownMenuItem className="text-red-300 hover:text-red-400 focus:bg-red-500/10 transition-colors cursor-pointer">
                  <LogOut className="w-4 h-4 mr-3" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
