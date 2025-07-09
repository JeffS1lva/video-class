import { useState, useRef } from "react";
import { User, Camera, X, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EditProfileDialogProps {
  userName: string;
  email: string;
  profileImage?: string;
  onProfileUpdate: (newUserName: string, newEmail: string, newProfileImage?: string) => void;
}

// Configuração da API com fallback
const API_BASE_URL =  "https://video-class-backend-production.up.railway.app/api";

export const EditProfileDialog = ({ 
  userName, 
  email, 
  profileImage, 
  onProfileUpdate 
}: EditProfileDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempUserName, setTempUserName] = useState(userName);
  const [tempEmail, setTempEmail] = useState(email);
  const [tempProfileImage, setTempProfileImage] = useState(profileImage);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token de autenticação não encontrado. Faça login novamente.');
    }
    return token;
  };

  // Função para fazer requisições com melhor tratamento de erros
  const makeApiRequest = async (url: string, options: RequestInit = {}) => {
    try {
      console.log('Fazendo requisição para:', url);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        // Adicionar timeout
        signal: AbortSignal.timeout(30000), // 30 segundos
      });

      console.log('Resposta recebida:', response.status, response.statusText);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: `Erro HTTP ${response.status}: ${response.statusText}` };
        }
        throw new Error(errorData.error || `Erro HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na requisição:', error);
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Não foi possível conectar com o servidor. Verifique se o backend está rodando.');
      }
      
     
      
      throw error;
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Verificar tamanho do arquivo (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Arquivo muito grande. Limite de 10MB.');
      return;
    }

    setIsUploadingImage(true);
    setError(null);

    try {
      const token = getAuthToken();
      
      // Converter arquivo para base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64Data = e.target?.result as string;
          
          const data = await makeApiRequest(`${API_BASE_URL}/upload-profile-image-base64`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ imageData: base64Data })
          });

          // Atualizar imagem temporária
          setTempProfileImage(data.profileImage);
          setSuccess('Imagem carregada com sucesso!');
          
          // Limpar mensagem de sucesso após 3 segundos
          setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
          console.error('Erro no upload:', error);
          setError(error instanceof Error ? error.message : 'Erro ao fazer upload da imagem');
        } finally {
          setIsUploadingImage(false);
        }
      };

      reader.onerror = () => {
        setError('Erro ao ler o arquivo');
        setIsUploadingImage(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erro no upload:', error);
      setError(error instanceof Error ? error.message : 'Erro ao fazer upload da imagem');
      setIsUploadingImage(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveImage = async () => {
    if (!tempProfileImage) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      
      await makeApiRequest(`${API_BASE_URL}/profile-image`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setTempProfileImage(undefined);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setSuccess('Imagem removida com sucesso!');
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Erro ao remover imagem:', error);
      setError(error instanceof Error ? error.message : 'Erro ao remover imagem');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!tempUserName.trim() || !tempEmail.trim()) {
      setError('Nome e email são obrigatórios');
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(tempEmail.trim())) {
      setError('Por favor, digite um email válido');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      
      console.log('Salvando perfil:', { name: tempUserName.trim(), email: tempEmail.trim() });
      
      const data = await makeApiRequest(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: tempUserName.trim(),
          email: tempEmail.trim()
        })
      });

      console.log('Perfil atualizado:', data);

      // Atualizar localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        const updatedUser = {
          ...user,
          name: data.user.name,
          email: data.user.email,
          profileImage: data.user.profileImage
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      // Chamar callback para atualizar estado no componente pai
      onProfileUpdate(data.user.name, data.user.email, data.user.profileImage);
      
      setSuccess('Perfil atualizado com sucesso!');
      
      // Fechar diálogo após 1 segundo
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(null);
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setError(error instanceof Error ? error.message : 'Erro ao atualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Resetar os valores temporários quando abrir o dialog
      setTempUserName(userName);
      setTempEmail(email);
      setTempProfileImage(profileImage);
      setError(null);
      setSuccess(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="text-gray-200 hover:text-white focus:bg-white/10 transition-colors cursor-pointer"
          onSelect={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
        >
          <User className="w-4 h-4 mr-3" />
          <span>Editar Perfil</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-blue-900 backdrop-blur-xl border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white text-center text-xl font-semibold">
            Editar Perfil
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Mensagens de erro e sucesso */}
          {error && (
            <Alert className="bg-red-500/10 border-red-500/50 text-red-200">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="bg-green-500/10 border-green-500/50 text-green-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Photo Upload Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <Avatar className="h-24 w-24 ring-4 ring-white/20 shadow-xl">
                {tempProfileImage ? (
                  <AvatarImage src={tempProfileImage} alt="Profile" className="object-cover" />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-2xl">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
              
              {/* Loading overlay */}
              {isUploadingImage && (
                <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
              
              {/* Remove Image Button */}
              {tempProfileImage && !isUploadingImage && (
                <button
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full p-1 shadow-lg transition-colors"
                  disabled={isLoading}
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              )}
              
              {/* Camera Overlay */}
              {!isUploadingImage && (
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              )}
            </div>

            {/* Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 w-full transition-colors ${
                isDragOver 
                  ? 'border-blue-400 bg-blue-500/10' 
                  : 'border-white/20 hover:border-white/40'
              } ${isUploadingImage ? 'pointer-events-none opacity-50' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isLoading || isUploadingImage}
              />
              
              <div className="flex flex-col items-center space-y-2 text-center">
                {isUploadingImage ? (
                  <>
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                    <div className="text-sm text-blue-400">Enviando imagem...</div>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400" />
                    <div className="text-sm text-gray-300">
                      <span className="font-medium text-blue-400">Clique para enviar</span> ou arraste uma imagem
                    </div>
                  </>
                )}
                <div className="text-xs text-gray-500">
                  PNG, JPG, GIF até 10MB
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-300">
                Nome Completo
              </Label>
              <Input
                id="name"
                value={tempUserName}
                onChange={(e) => setTempUserName(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                placeholder="Digite seu nome completo"
                disabled={isLoading || isUploadingImage}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                placeholder="Digite seu email"
                disabled={isLoading || isUploadingImage}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="border-white/20 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            disabled={isLoading || isUploadingImage}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveProfile}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={isLoading || isUploadingImage}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Salvando...</span>
              </div>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};