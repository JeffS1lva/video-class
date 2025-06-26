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