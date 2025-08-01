import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import CPFVerificationForm from "@/components/CPFVerificationForm";
import RegistrationForm from "@/components/RegistrationForm";
import BookOrderForm from "@/components/BookOrderForm";
import CheckoutPage from "@/components/CheckoutPage";
import { MessageCircle, Sparkles, Users, BookOpen, CreditCard } from "lucide-react";

export type Student = {
  cpf: string;
  nome: string;
  email: string;
  registered: boolean;
};

export type BookOrder = {
  studentName: string;
  cpf: string;
  email: string;
  bookName: string;
  price: number;
  cycle?: string;
};

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'cpf' | 'registration' | 'bookOrder' | 'checkout'>('cpf');
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [currentBookOrder, setCurrentBookOrder] = useState<BookOrder | null>(null);

  const handleCPFVerified = (student: Student) => {
    setCurrentStudent(student);
    if (student.registered) {
      setCurrentStep('bookOrder');
    } else {
      setCurrentStep('registration');
    }
  };

  const handleRegistrationComplete = (student: Student) => {
    setCurrentStudent(student);
    setCurrentStep('bookOrder');
  };

  const handleBookOrderComplete = (bookOrder: BookOrder) => {
    setCurrentBookOrder(bookOrder);
    setCurrentStep('checkout');
  };

  const handleBackToCPF = () => {
    setCurrentStep('cpf');
    setCurrentStudent(null);
    setCurrentBookOrder(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      
      <div className="relative z-10 min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header moderno */}
          <div className="text-center mb-12 pt-8">
            {/* Logo da Igreja */}
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <img 
                    src="https://admissaoprv.com.br/wp-content/uploads/2023/11/Logo-PRV-Texto-Branco.png" 
                    alt="Igreja PRV Logo" 
                    className="h-16 w-auto object-contain filter drop-shadow-lg"
                  />
                </div>
              </div>
            </div>

            {/* Título principal com efeito gradiente */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-4 animate-fade-in">
                Sistema de Controle
              </h1>
              <h2 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-blue-200 to-purple-300 bg-clip-text text-transparent mb-6">
                EETAD - NÚCLEO PALMAS/TO
              </h2>
              <p className="text-xl text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
                Plataforma moderna para interação com alunos do curso de teologia
              </p>
            </div>
            
            {/* Botão do assistente virtual modernizado */}
            <div className="mt-8">
              <Button 
                onClick={() => window.open('/chatbot-test', '_blank')}
                className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-none font-semibold px-8 py-4 rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/25"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 animate-bounce" />
                  <span className="text-lg">Assistente Virtual</span>
                  <Sparkles className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>
              </Button>
            </div>

            {/* Indicadores de progresso */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <div className={`flex items-center space-x-2 ${currentStep === 'cpf' ? 'text-white' : 'text-white/50'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'cpf' ? 'bg-blue-500' : 'bg-white/20'} transition-all duration-300`}>
                    <Users className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium hidden sm:block">CPF</span>
                </div>
                
                <div className="w-8 h-0.5 bg-white/30"></div>
                
                <div className={`flex items-center space-x-2 ${currentStep === 'registration' ? 'text-white' : 'text-white/50'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'registration' ? 'bg-purple-500' : 'bg-white/20'} transition-all duration-300`}>
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium hidden sm:block">Matrícula</span>
                </div>
                
                <div className="w-8 h-0.5 bg-white/30"></div>
                
                <div className={`flex items-center space-x-2 ${currentStep === 'bookOrder' ? 'text-white' : 'text-white/50'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'bookOrder' ? 'bg-emerald-500' : 'bg-white/20'} transition-all duration-300`}>
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium hidden sm:block">Pedido</span>
                </div>
                
                <div className="w-8 h-0.5 bg-white/30"></div>
                
                <div className={`flex items-center space-x-2 ${currentStep === 'checkout' ? 'text-white' : 'text-white/50'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'checkout' ? 'bg-orange-500' : 'bg-white/20'} transition-all duration-300`}>
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium hidden sm:block">Pagamento</span>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo principal */}
          <div className="flex justify-center">
            {currentStep === 'cpf' && (
              <div className="w-full max-w-md animate-fade-in">
                <CPFVerificationForm onCPFVerified={handleCPFVerified} />
              </div>
            )}

            {currentStep === 'registration' && currentStudent && (
              <div className="w-full max-w-4xl animate-slide-in">
                <RegistrationForm 
                  cpf={currentStudent.cpf} 
                  onRegistrationComplete={handleRegistrationComplete}
                  onBack={handleBackToCPF}
                />
              </div>
            )}

            {currentStep === 'bookOrder' && currentStudent && (
              <div className="w-full max-w-4xl animate-slide-in">
                <BookOrderForm 
                  student={currentStudent}
                  onBookOrderComplete={handleBookOrderComplete}
                  onBack={handleBackToCPF}
                />
              </div>
            )}

            {currentStep === 'checkout' && currentBookOrder && (
              <div className="w-full max-w-4xl animate-slide-in">
                <CheckoutPage 
                  bookOrder={currentBookOrder}
                  onBack={() => setCurrentStep('bookOrder')}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;