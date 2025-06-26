import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User, Key } from "lucide-react";
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

interface UserProfileDropdownProps {
  userName: string;
}

export const UserProfileDropdown = ({ userName: initialUserName }: UserProfileDropdownProps) => {
  const [userName, setUserName] = useState(initialUserName);
  const [email, setEmail] = useState("usuario@exemplo.com");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [tempUserName, setTempUserName] = useState(userName);
  const [tempEmail, setTempEmail] = useState(email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const handleSaveProfile = () => {
    setUserName(tempUserName);
    setEmail(tempEmail);
    setIsEditingProfile(false);
    // Aqui você pode adicionar a lógica para salvar no backend
    console.log("Perfil atualizado:", { nome: tempUserName, email: tempEmail });
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    if (newPassword.length < 6) {
      alert("A nova senha deve ter pelo menos 6 caracteres!");
      return;
    }

    // Aqui você pode adicionar a lógica para alterar a senha no backend
    console.log("Senha alterada com sucesso");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsChangingPassword(false);
    alert("Senha alterada com sucesso!");
  };

  const handleLogout = () => {
    // Aqui você pode adicionar a lógica de logout
    console.log("Usuário deslogado");
    alert("Você foi desconectado!");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative p-1 rounded-xl hover:bg-white/10 transition-all duration-300 group"
        >
          <Avatar className="h-9 w-9 ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300 shadow-lg">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-sm">
              {initials}
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
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {userName}
              </p>
              <p className="text-xs text-gray-300">Estudante</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />

        {/* Botão Editar Perfil */}
        <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
          <DialogTrigger asChild>
            <DropdownMenuItem
              className="text-gray-200 hover:text-white focus:bg-white/10 transition-colors cursor-pointer"
              onSelect={(e) => {
                e.preventDefault();
                setTempUserName(userName);
                setTempEmail(email);
                setIsEditingProfile(true);
              }}
            >
              <User className="w-4 h-4 mr-3" />
              <span>Editar Perfil</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-black/95 backdrop-blur-xl border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Editar Perfil</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-gray-300">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={tempUserName}
                  onChange={(e) => setTempUserName(e.target.value)}
                  className="col-span-3 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  className="col-span-3 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEditingProfile(false)}
                className="border-white/20 text-gray-300 hover:text-white hover:bg-white/10"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveProfile}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

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
              >
                Cancelar
              </Button>
              <Button
                onClick={handleChangePassword}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                Alterar Senha
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem
          className="text-red-300 hover:text-red-400 focus:bg-red-500/10 transition-colors cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};