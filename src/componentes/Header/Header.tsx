import { NotificationPopover } from "./Notification/NotificationPopover";
import { UserProfileDropdown } from "./Perfil/UserProfile";
import { BookOpen, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PlatformHeaderProps {
  completionRate?: number;
  userName?: string;
  courseName?: string;
  notifications?: number;
}

export const PlatformHeader = ({
  completionRate = 75,
  userName = "João Silva",
  courseName = "Curso React Avançado",
  notifications = 3,
}: PlatformHeaderProps) => {
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
      <div className="mx-2 sm:mx-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo e Informações do Curso - Lado Esquerdo */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-white/10 flex-shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                EduPlatform
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 font-medium truncate">
                {courseName}
              </p>
            </div>
          </div>

          {/* Ações do Usuário - Lado Direito */}
          <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
            {/* Badge de Progresso Original - Telas grandes (md+) */}
            <Badge
              variant="secondary"
              className="hidden md:flex bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-100 border-emerald-400/30 hover:from-emerald-500/30 hover:to-green-500/30 transition-all duration-300 px-2 sm:px-3 py-1 sm:py-1.5 font-semibold text-xs sm:text-sm"
            >
              <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-emerald-300" />
              <span className="hidden lg:inline">{completionRate}% Completo</span>
              <span className="lg:hidden">{completionRate}%</span>
            </Badge>

            {/* Progresso Compacto para telas pequenas (sm) */}
            <div className="hidden sm:flex md:hidden items-center space-x-1 bg-white/5 backdrop-blur-sm rounded-lg px-2 py-1 border border-white/10">
              <Award className="w-3 h-3 text-emerald-300" />
              <span className="text-xs font-semibold text-white">
                {completionRate}%
              </span>
            </div>

            {/* Progresso Mínimo para mobile (xs) - OCULTO */}
            <div className="hidden">
              <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                <Award className="w-3 h-3 text-emerald-300" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white text-[8px]">
                  {Math.round(completionRate / 10)}
                </span>
              </div>
            </div>

            <NotificationPopover
              notifications={notifications}
              notificationItems={notificationItems}
            />

            <UserProfileDropdown userName={userName} />
          </div>
        </div>
      </div>
    </header>
  );
};