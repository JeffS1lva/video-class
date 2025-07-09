import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ChevronRight,
  Play,
  Zap,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

export function LoginSignupScreen() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // URL da sua API - ajuste conforme necessário
  const API_URL = '/api'; 

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Limpar mensagem ao digitar
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setMessage({ type: 'error', text: 'Email e senha são obrigatórios' });
      return false;
    }

    if (!isLogin) {
      if (!formData.name) {
        setMessage({ type: 'error', text: 'Nome é obrigatório' });
        return false;
      }
      if (!formData.confirmPassword) {
        setMessage({ type: 'error', text: 'Confirmação de senha é obrigatória' });
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'As senhas não coincidem' });
        return false;
      }
      if (formData.password.length < 6) {
        setMessage({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres' });
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: 'error', text: 'Email inválido' });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const endpoint = isLogin ? '/login' : '/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { 
            name: formData.name, 
            email: formData.email, 
            password: formData.password, 
            confirmPassword: formData.confirmPassword 
          };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Sucesso
        setMessage({ 
          type: 'success', 
          text: isLogin ? 'Login realizado com sucesso!' : 'Cadastro realizado com sucesso!' 
        });
        
        // Salvar token no localStorage
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Redirecionar para o dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
        
        // Limpar formulário
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        
      } else {
        // Erro da API
        setMessage({ type: 'error', text: data.error || 'Erro desconhecido' });
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setMessage({ type: 'error', text: 'Erro de conexão com o servidor' });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    "Acesso a todos os cursos",
    "Certificados reconhecidos",
    "Suporte 24/7",
    "Projetos práticos",
    "Comunidade exclusiva",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Seção Informativa */}
      <div className="hidden lg:flex lg:w-3/5 flex-col justify-center p-12 relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative z-10 max-w-3xl">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center mb-8">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mr-4">
                <Play className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">DevMaster</h1>
            </div>
            <h2 className="text-6xl font-bold text-white mb-8 leading-tight">
              Acelere sua
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                {" "}
                carreira em tech
              </span>
            </h2>
            <p className="text-gray-300 text-xl leading-relaxed max-w-2xl">
              Aprenda com projetos reais, receba mentoria especializada e
              conecte-se com uma comunidade vibrante de desenvolvedores.
            </p>
          </div>

          {/* Características */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="flex items-center mb-6">
              <Zap className="w-6 h-6 text-yellow-400 mr-2" />
              <h3 className="text-2xl font-bold text-white">Plano Pro</h3>
              <span className="ml-4 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                50% OFF
              </span>
            </div>

            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-bold text-white">R$ 89</span>
              <span className="text-gray-400 ml-2">/mês</span>
              <span className="text-gray-500 line-through ml-4">R$ 179</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mr-3"></div>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Login/Cadastro */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
            {/* Cabeçalho Mobile */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <Play className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">DevMaster</h1>
              </div>
            </div>

            {/* Cabeçalho */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                {isLogin ? "Bem-vindo!" : "Começar agora"}
              </h2>
              <p className="text-gray-300">
                {isLogin
                  ? "Entre para continuar aprendendo"
                  : "Crie sua conta gratuita"}
              </p>
            </div>

            {/* Mensagem de feedback */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg flex items-center ${
                message.type === 'error' 
                  ? 'bg-red-500/20 border border-red-500/30 text-red-300' 
                  : 'bg-green-500/20 border border-green-500/30 text-green-300'
              }`}>
                {message.type === 'error' ? (
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                )}
                <span className="text-sm">{message.text}</span>
              </div>
            )}

            {/* Toggle */}
            <div className="flex bg-black/20 rounded-lg p-1 mb-6">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setMessage({ type: '', text: '' });
                }}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
                  isLogin
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Entrar
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setMessage({ type: '', text: '' });
                }}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
                  !isLogin
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Cadastrar
              </button>
            </div>

            {/* Formulário */}
            <div className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Nome completo"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-4 px-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-4 px-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Senha"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-4 px-12 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {!isLogin && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirmar senha"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-4 px-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {isLogin ? "Entrando..." : "Criando conta..."}
                  </>
                ) : (
                  <>
                    {isLogin ? "Entrar" : "Criar conta"}
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </div>

            {/* Divisor */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-white/20"></div>
              <span className="px-3 text-gray-400 text-sm">ou</span>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>

            {/* Login Social */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                disabled={loading}
                className="bg-white text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 flex items-center justify-center disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>

              <button 
                disabled={loading}
                className="bg-[#1877F2] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#166FE5] transition-all duration-200 flex items-center justify-center disabled:opacity-50"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>

            {/* Rodapé */}
            <div className="text-center mt-6">
              <p className="text-gray-400 text-sm">
                Ao continuar, você aceita nossos{" "}
                <button className="text-purple-400 hover:text-purple-300 underline">
                  termos
                </button>{" "}
                e{" "}
                <button className="text-purple-400 hover:text-purple-300 underline">
                  política de privacidade
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}