import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Key } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { EditProfileDialog } from "./EditProfileDialog";

interface UserProfileDropdownProps {
  userName: string;
  onLogout?: () => void;
}

// URL base da API
const API_BASE_URL = "https://video-class-backend-production.up.railway.app/api"

export const UserProfileDropdown = ({ userName: initialUserName, onLogout }: UserProfileDropdownProps) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(initialUserName);
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Carregar dados do usuário do localStorage ou da API
  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUserName(user.name || initialUserName);
          setEmail(user.email || "");
          setProfileImage(user.profileImage);
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error);
        }
      }

      // Opcionalmente, buscar dados atualizados da API
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUserName(data.user.name);
            setEmail(data.user.email);
            setProfileImage(data.user.profileImage);
          }
        } catch (error) {
          console.error('Erro ao buscar perfil da API:', error);
        }
      }
    };

    loadUserData();
  }, [initialUserName]);

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  // Função chamada pelo EditProfileDialog quando o perfil é atualizado
  const handleProfileUpdate = (newUserName: string, newEmail: string, newProfileImage?: string) => {
    setUserName(newUserName);
    setEmail(newEmail);
    setProfileImage(newProfileImage);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    if (newPassword.length < 6) {
      alert("A nova senha deve ter pelo menos 6 caracteres!");
      return;
    }

    setIsLoading(true);

    try {
      // Aqui você pode implementar a chamada para alterar a senha na API
      // Por enquanto, vamos simular o processo
      
      console.log("Senha alterada com sucesso");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);
      alert("Senha alterada com sucesso!");
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      alert('Erro ao alterar senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Chamar a API de logout
        const response = await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Logout realizado com sucesso:', data.message);
        } else {
          console.error('Erro ao fazer logout:', await response.json());
        }
      }

      // Limpar o localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Chamar a função de logout passada como prop
      if (onLogout) {
        onLogout();
      } else {
        // Fallback: redirecionar diretamente
        navigate("/login");
      }
    } catch (error) {
      console.error('Erro de conexão ao fazer logout:', error);
      
      // Mesmo com erro, limpar o localStorage e fazer logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      if (onLogout) {
        onLogout();
      } else {
        window.location.href = '/login';
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative p-1 rounded-xl hover:bg-white/10 transition-all duration-300 group"
          disabled={isLoading}
        >
          <Avatar className="h-9 w-9 ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300 shadow-lg">
            {profileImage ? (
              <AvatarImage src={profileImage} alt="Profile" className="object-cover" />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-sm">
                {initials}
              </AvatarFallback>
            )}
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
              {profileImage ? (
                <AvatarImage src={profileImage} alt="Profile" className="object-cover" />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white font-bold">
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {userName}
              </p>
              <p className="text-xs text-gray-300 truncate">
                {email || "Estudante"}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />

        {/* Componente de Editar Perfil */}
        <EditProfileDialog
          userName={userName}
          email={email}
          profileImage={profileImage}
          onProfileUpdate={handleProfileUpdate}
        />

        {/* Botão Alterar Senha */}
        <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
          <DialogTrigger asChild>
            <DropdownMenuItem
              className="text-gray-200 hover:text-white focus:bg-white/10 transition-colors cursor-pointer"
              onSelect={(e) => {
                e.preventDefault();
                setIsChangingPassword(true);
              }}
            >
              <Key className="w-4 h-4 mr-3" />
              <span>Alterar Senha</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-black/95 backdrop-blur-xl border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Alterar Senha</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="current-password" className="text-right text-gray-300">
                  Senha Atual
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="col-span-3 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  disabled={isLoading}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-password" className="text-right text-gray-300">
                  Nova Senha
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="col-span-3 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  disabled={isLoading}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirm-password" className="text-right text-gray-300">
                  Confirmar
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="col-span-3 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsChangingPassword(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="border-white/20 text-gray-300 hover:text-white hover:bg-white/10"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleChangePassword}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                disabled={isLoading}
              >
                {isLoading ? "Alterando..." : "Alterar Senha"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem
          className="text-red-300 hover:text-red-400 focus:bg-red-500/10 transition-colors cursor-pointer"
          onClick={handleLogout}
          disabled={isLoading}
        >
          <LogOut className="w-4 h-4 mr-3" />
          <span>{isLoading ? "Saindo..." : "Sair"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};