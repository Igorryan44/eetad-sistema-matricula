
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Student } from "@/pages/Index";
import { 
  ArrowLeft, 
  GraduationCap, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  BookOpen,
  School,
  UserCheck,
  Save,
  Loader2
} from "lucide-react";

interface RegistrationFormProps {
  cpf: string;
  onRegistrationComplete: (student: Student) => void;
  onBack: () => void;
}

const RegistrationForm = ({ cpf, onRegistrationComplete, onBack }: RegistrationFormProps) => {
  const [formData, setFormData] = useState({
    // Informações Acadêmicas
    possuiFormacao: "false",
    estudou_na_eetad: "",
    mod_obs: "",
    modalidade: "",
    nucleo: "",
    matricula: "",
    ciclo: "",
    ra: "",
    ciclo_ra: "",
    
    // Ciclo de Matrícula
    mat_ciclo: "",
    
    // Núcleo de Matrícula
    matnucleo: "1979",
    congregacao: "000",
    
    // Dados do Aluno
    nome: "",
    email: "",
    rg: "",
    fone: "",
    sexo: "",
    dtnascimento: "",
    estcivil: "",
    cidadenascimento: "",
    ufnascimento: "",
    nacionalidade: "Brasileira",
    escolaridade: "",
    profissao: "",
    cargo: "",
    
    // Endereço
    endereco: "",
    cep: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade_alu: "",
    uf: ""
  });

  const [showAcademicInfo, setShowAcademicInfo] = useState(false);
  const [showModalityInfo, setShowModalityInfo] = useState(false);
  const [showPresentialInfo, setShowPresentialInfo] = useState(false);
  const [showEADInfo, setShowEADInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const estados = [
    { value: "AC", label: "Acre" },
    { value: "AL", label: "Alagoas" },
    { value: "AP", label: "Amapá" },
    { value: "AM", label: "Amazonas" },
    { value: "BA", label: "Bahia" },
    { value: "CE", label: "Ceará" },
    { value: "DF", label: "Distrito Federal" },
    { value: "ES", label: "Espírito Santo" },
    { value: "GO", label: "Goiás" },
    { value: "MA", label: "Maranhão" },
    { value: "MT", label: "Mato Grosso" },
    { value: "MS", label: "Mato Grosso do Sul" },
    { value: "MG", label: "Minas Gerais" },
    { value: "PA", label: "Pará" },
    { value: "PB", label: "Paraíba" },
    { value: "PR", label: "Paraná" },
    { value: "PE", label: "Pernambuco" },
    { value: "PI", label: "Piauí" },
    { value: "RJ", label: "Rio de Janeiro" },
    { value: "RN", label: "Rio Grande do Norte" },
    { value: "RS", label: "Rio Grande do Sul" },
    { value: "RO", label: "Rondônia" },
    { value: "RR", label: "Roraima" },
    { value: "SC", label: "Santa Catarina" },
    { value: "SP", label: "São Paulo" },
    { value: "SE", label: "Sergipe" },
    { value: "TO", label: "Tocantins" }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Lógica para mostrar/esconder seções
    if (field === "possuiFormacao") {
      setShowAcademicInfo(value === "true");
      if (value === "false") {
        setShowModalityInfo(false);
        setShowPresentialInfo(false);
        setShowEADInfo(false);
      }
    }
    
    if (field === "estudou_na_eetad") {
      setShowModalityInfo(value === "true");
      if (value === "false") {
        setShowPresentialInfo(false);
        setShowEADInfo(false);
      }
    }
    
    if (field === "modalidade") {
      setShowPresentialInfo(value === "Nucleo Presencial");
      setShowEADInfo(value === "WebCurso" || value === "TeleCurso");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validações básicas
      if (!formData.nome || !formData.email || !formData.fone) {
        throw new Error("Preencha todos os campos obrigatórios");
      }

      const studentData = {
        origem_academica: formData.possuiFormacao === "true" ? "Possui formação teológica" : "Primeira formação teológica",
        em_qual_escola_estudou: formData.estudou_na_eetad === "true" ? "EETAD" : "Outra escola",
        em_qual_modalidade_estudou: formData.modalidade || "N/A",
        ciclo: formData.mat_ciclo,
        nucleo: formData.matnucleo,
        congregacao: formData.congregacao,
        nome: formData.nome,
        rg: formData.rg,
        cpf: cpf,
        telefone: formData.fone,
        email: formData.email,
        sexo: formData.sexo,
        estado_civil: formData.estcivil,
        data_nascimento: formData.dtnascimento,
        uf_nascimento: formData.ufnascimento,
        escolaridade: formData.escolaridade,
        profissao: formData.profissao,
        nacionalidade: formData.nacionalidade,
        cargo_igreja: formData.cargo,
        endereco_rua: formData.endereco,
        cep: formData.cep,
        numero: formData.numero,
        bairro: formData.bairro,
        cidade: formData.cidade_alu,
        uf: formData.uf,
        matricula_numero: `EETAD${Date.now()}`
      };

      // Salvar no Google Sheets via Edge Function
      const response = await fetch(`https://umkizxftwrwqiiahjbrr.supabase.co/functions/v1/save-student-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVta2l6eGZ0d3J3cWlpYWhqYnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNzEyNzIsImV4cCI6MjA2NDY0NzI3Mn0.6rGPdMiRcQ_plkkkHiwy73rOrSoGcLwAqZogNyQplTs'
        },
        body: JSON.stringify(studentData)
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar matrícula');
      }

      // Enviar notificação WhatsApp para secretaria
      await fetch(`https://umkizxftwrwqiiahjbrr.supabase.co/functions/v1/send-whatsapp-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVta2l6eGZ0d3J3cWlpYWhqYnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNzEyNzIsImV4cCI6MjA2NDY0NzI3Mn0.6rGPdMiRcQ_plkkkHiwy73rOrSoGcLwAqZogNyQplTs'
        },
        body: JSON.stringify({
          type: 'registration',
          studentData: studentData
        })
      });

      // Enviar notificação WhatsApp para o aluno
      await fetch(`https://umkizxftwrwqiiahjbrr.supabase.co/functions/v1/send-whatsapp-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVta2l6eGZ0d3J3cWlpYWhqYnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNzEyNzIsImV4cCI6MjA2NDY0NzI3Mn0.6rGPdMiRcQ_plkkkHiwy73rOrSoGcLwAqZogNyQplTs'
        },
        body: JSON.stringify({
          type: 'student_registration',
          studentData: studentData
        })
      });

      // Enviar email de confirmação de matrícula
      try {
        await fetch(`https://umkizxftwrwqiiahjbrr.supabase.co/functions/v1/send-email-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVta2l6eGZ0d3J3cWlpYWhqYnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNzEyNzIsImV4cCI6MjA2NDY0NzI3Mn0.6rGPdMiRcQ_plkkkHiwy73rOrSoGcLwAqZogNyQplTs'
          },
          body: JSON.stringify({
            type: 'registration',
            studentData: {
              nome: studentData.nome,
              email: studentData.email,
              cpf: studentData.cpf,
              telefone: studentData.fone,
              ciclo: studentData.mat_ciclo
            }
          })
        });
        console.log('✅ Email de confirmação de matrícula enviado');
      } catch (emailError) {
        console.error('❌ Erro ao enviar email de confirmação:', emailError);
        // Não falha a matrícula se o email não for enviado
      }

      toast({
        title: "Matrícula realizada com sucesso!",
        description: "Você receberá confirmações por WhatsApp e email em breve."
      });

      onRegistrationComplete({
        cpf: cpf,
        nome: formData.nome,
        email: formData.email,
        registered: true
      });

    } catch (error) {
      toast({
        title: "Erro na matrícula",
        description: error instanceof Error ? error.message : "Tente novamente",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Efeito de brilho de fundo */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 rounded-2xl blur opacity-30 animate-pulse"></div>
      
      <Card className="relative bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden">
        {/* Header modernizado */}
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
            }}
          ></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-300 hover:scale-110"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">Formulário de Matrícula</CardTitle>
                  <CardDescription className="text-purple-100 text-lg">
                    Complete seus dados para finalizar a matrícula
                  </CardDescription>
                </div>
              </div>
            </div>
            
            {/* Indicador de progresso */}
            <div className="flex items-center gap-2 text-sm text-purple-100">
              <UserCheck className="h-4 w-4" />
              <span>CPF: {cpf}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informações Acadêmicas */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <School className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Origem Acadêmica do Aluno</h3>
              </div>
              
              <div className="space-y-3">
                <Label className="text-base font-semibold text-gray-700 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  Possui Formação Teológica?
                </Label>
                <Select value={formData.possuiFormacao} onValueChange={(value) => handleInputChange("possuiFormacao", value)}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl">
                    <SelectValue placeholder="-- Selecione --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Nunca estudou teologia</SelectItem>
                    <SelectItem value="true">Sim, já estudou teologia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {showAcademicInfo && (
                <div className="space-y-6 bg-blue-50 p-6 rounded-xl border-l-4 border-blue-400 animate-fade-in">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-gray-700">Em qual escola estudou?</Label>
                    <Select value={formData.estudou_na_eetad} onValueChange={(value) => handleInputChange("estudou_na_eetad", value)}>
                      <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl">
                        <SelectValue placeholder="-- Selecione --" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">EETAD</SelectItem>
                        <SelectItem value="false">Outra Escola</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="mod_obs" className="text-base font-semibold text-gray-700">Observação</Label>
                    <Input
                      id="mod_obs"
                      placeholder="Escreva todas as informações sobre sua formação teológica."
                      value={formData.mod_obs}
                      onChange={(e) => handleInputChange("mod_obs", e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                    />
                  </div>

                  {showModalityInfo && (
                    <div className="space-y-6 bg-green-50 p-6 rounded-xl border-l-4 border-green-400 animate-fade-in">
                      <h4 className="font-semibold text-lg text-gray-800">Em Qual Modalidade Estudou?</h4>
                      <Select value={formData.modalidade} onValueChange={(value) => handleInputChange("modalidade", value)}>
                        <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl">
                          <SelectValue placeholder="-- Selecione --" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Nucleo Presencial">Núcleos Presenciais</SelectItem>
                          <SelectItem value="WebCurso">WebCurso</SelectItem>
                          <SelectItem value="TeleCurso">TeleCurso</SelectItem>
                        </SelectContent>
                      </Select>

                      {showPresentialInfo && (
                        <div className="space-y-6 bg-yellow-50 p-6 rounded-xl border-l-4 border-yellow-400 animate-fade-in">
                          <h5 className="font-semibold text-lg text-gray-800">Em qual núcleo e ciclo estudou?</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <Label htmlFor="nucleo" className="text-base font-semibold text-gray-700">Núcleo</Label>
                              <Input
                                id="nucleo"
                                placeholder="0000"
                                value={formData.nucleo}
                                onChange={(e) => handleInputChange("nucleo", e.target.value)}
                                className="h-12 border-2 border-gray-200 focus:border-yellow-500 rounded-xl"
                              />
                            </div>
                            <div className="space-y-3">
                              <Label htmlFor="matricula" className="text-base font-semibold text-gray-700">Matrícula</Label>
                              <Input
                                id="matricula"
                                placeholder="0000"
                                value={formData.matricula}
                                onChange={(e) => handleInputChange("matricula", e.target.value)}
                                readOnly
                                className="h-12 border-2 border-gray-200 bg-gray-100 rounded-xl"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <Label className="text-base font-semibold text-gray-700">Ciclo</Label>
                            <Select value={formData.ciclo} onValueChange={(value) => handleInputChange("ciclo", value)}>
                              <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-yellow-500 rounded-xl">
                                <SelectValue placeholder="-- Selecione --" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Basico">1º Ciclo Básico</SelectItem>
                                <SelectItem value="Medio I">2º Ciclo Médio I</SelectItem>
                                <SelectItem value="Medio II">2º Ciclo Médio II</SelectItem>
                                <SelectItem value="Bacharel">3º Ciclo Avançado</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}

                      {showEADInfo && (
                        <div className="space-y-6 bg-purple-50 p-6 rounded-xl border-l-4 border-purple-400 animate-fade-in">
                          <h5 className="font-semibold text-lg text-gray-800">Qual o RA e ciclo que estudou?</h5>
                          <div className="space-y-3">
                            <Label htmlFor="ra" className="text-base font-semibold text-gray-700">RA</Label>
                            <Input
                              id="ra"
                              placeholder="00000"
                              value={formData.ra}
                              onChange={(e) => handleInputChange("ra", e.target.value)}
                              className="h-12 border-2 border-gray-200 focus:border-purple-500 rounded-xl w-48"
                            />
                          </div>
                        
                          <Select value={formData.ciclo_ra} onValueChange={(value) => handleInputChange("ciclo_ra", value)}>
                            <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-purple-500 rounded-xl">
                              <SelectValue placeholder="-- Selecione --" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Basico">1º Ciclo Básico</SelectItem>
                              <SelectItem value="Medio I">2º Ciclo Médio I</SelectItem>
                              <SelectItem value="Medio II">2º Ciclo Médio II</SelectItem>
                              <SelectItem value="Bacharel">3º Ciclo Avançado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Ciclo de Matrícula */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Ciclo de Matrícula</h3>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="mat_ciclo" className="text-base font-semibold text-gray-700">Ciclo</Label>
                <Select value={formData.mat_ciclo} onValueChange={(value) => handleInputChange("mat_ciclo", value)}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl">
                    <SelectValue placeholder="-- Selecione --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1º Ciclo Básico</SelectItem>
                    <SelectItem value="2">2º Ciclo Médio I</SelectItem>
                    <SelectItem value="3">2º Ciclo Médio II</SelectItem>
                    <SelectItem value="4">3º Ciclo Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Núcleo de Matrícula */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Núcleo de Matrícula</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="matnucleo" className="text-base font-semibold text-gray-700">Núcleo</Label>
                  <Input
                    id="matnucleo"
                    value={formData.matnucleo}
                    onChange={(e) => handleInputChange("matnucleo", e.target.value)}
                    readOnly
                    className="h-12 border-2 border-gray-200 bg-gray-100 rounded-xl"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="congregacao" className="text-base font-semibold text-gray-700">Congregação</Label>
                  <Input
                    id="congregacao"
                    value={formData.congregacao}
                    onChange={(e) => handleInputChange("congregacao", e.target.value)}
                    required
                    className="h-12 border-2 border-gray-200 focus:border-orange-500 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Dados do Aluno */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Dados do Aluno</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="nome" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    Nome Completo
                  </Label>
                  <Input
                    id="nome"
                    placeholder="Nome completo"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    required
                    maxLength={40}
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="E-mail"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    maxLength={60}
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="rg" className="text-base font-semibold text-gray-700">RG</Label>
                  <Input
                    id="rg"
                    placeholder="00.000.000-0"
                    value={formData.rg}
                    onChange={(e) => handleInputChange("rg", e.target.value)}
                    required
                    maxLength={15}
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="cpf" className="text-base font-semibold text-gray-700">CPF</Label>
                  <Input
                    id="cpf"
                    value={cpf}
                    readOnly
                    required
                    className="h-12 border-2 border-gray-200 bg-gray-100 rounded-xl"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="fone" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    Telefone
                  </Label>
                  <Input
                    id="fone"
                    placeholder="+5500000000000"
                    value={formData.fone}
                    onChange={(e) => handleInputChange("fone", e.target.value)}
                    required
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="sexo" className="text-base font-semibold text-gray-700">Sexo</Label>
                  <Select value={formData.sexo} onValueChange={(value) => handleInputChange("sexo", value)}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl">
                      <SelectValue placeholder="-- Selecione --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="dtnascimento" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Data de Nascimento
                  </Label>
                  <Input
                    id="dtnascimento"
                    placeholder="DD/MM/AAAA"
                    value={formData.dtnascimento}
                    onChange={(e) => handleInputChange("dtnascimento", e.target.value)}
                    required
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="estcivil" className="text-base font-semibold text-gray-700">Estado Civil</Label>
                  <Select value={formData.estcivil} onValueChange={(value) => handleInputChange("estcivil", value)}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl">
                      <SelectValue placeholder="-- Selecione --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Solteiro">Solteiro</SelectItem>
                      <SelectItem value="Casado">Casado</SelectItem>
                      <SelectItem value="Divorciado">Divorciado</SelectItem>
                      <SelectItem value="Viuvo">Viúvo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="cidadenascimento" className="text-base font-semibold text-gray-700">Cidade de Nascimento</Label>
                  <Input
                    id="cidadenascimento"
                    placeholder="Cidade onde Nasceu"
                    value={formData.cidadenascimento}
                    onChange={(e) => handleInputChange("cidadenascimento", e.target.value)}
                    required
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="ufnascimento" className="text-base font-semibold text-gray-700">UF Nascimento</Label>
                  <Select value={formData.ufnascimento} onValueChange={(value) => handleInputChange("ufnascimento", value)}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl">
                      <SelectValue placeholder="-- Selecione --" />
                    </SelectTrigger>
                    <SelectContent>
                      {estados.map((estado) => (
                        <SelectItem key={estado.value} value={estado.value}>
                          {estado.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="nacionalidade" className="text-base font-semibold text-gray-700">Nacionalidade</Label>
                  <Input
                    id="nacionalidade"
                    placeholder="Nacionalidade"
                    value={formData.nacionalidade}
                    onChange={(e) => handleInputChange("nacionalidade", e.target.value)}
                    required
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="escolaridade" className="text-base font-semibold text-gray-700">Escolaridade</Label>
                  <Select value={formData.escolaridade} onValueChange={(value) => handleInputChange("escolaridade", value)}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl">
                      <SelectValue placeholder="-- Selecione --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ensino Fundamental Incompleto">Ensino Fundamental Incompleto</SelectItem>
                      <SelectItem value="Ensino Fundamental Completo">Ensino Fundamental Completo</SelectItem>
                      <SelectItem value="Ensino Médio Incompleto">Ensino Médio Incompleto</SelectItem>
                      <SelectItem value="Ensino Médio Completo">Ensino Médio Completo</SelectItem>
                      <SelectItem value="Ensino Superior Incompleto">Ensino Superior Incompleto</SelectItem>
                      <SelectItem value="Ensino Superior Completo">Ensino Superior Completo</SelectItem>
                      <SelectItem value="Pós-graduação">Pós-graduação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="profissao" className="text-base font-semibold text-gray-700">Profissão</Label>
                  <Input
                    id="profissao"
                    placeholder="Profissão"
                    value={formData.profissao}
                    onChange={(e) => handleInputChange("profissao", e.target.value)}
                    required
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="cargo" className="text-base font-semibold text-gray-700">Exerce cargo na igreja? Qual?</Label>
                  <Input
                    id="cargo"
                    placeholder="Cargo"
                    value={formData.cargo}
                    onChange={(e) => handleInputChange("cargo", e.target.value)}
                    required
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Endereço</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="endereco" className="text-base font-semibold text-gray-700 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    Rua
                  </Label>
                  <Input
                    id="endereco"
                    placeholder="Endereço"
                    value={formData.endereco}
                    onChange={(e) => handleInputChange("endereco", e.target.value)}
                    required
                    className="h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="cep" className="text-base font-semibold text-gray-700">CEP - Zip Code</Label>
                  <Input
                    id="cep"
                    placeholder="00000-000"
                    value={formData.cep}
                    onChange={(e) => handleInputChange("cep", e.target.value)}
                    required
                    className="h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="numero" className="text-base font-semibold text-gray-700">Número</Label>
                  <Input
                    id="numero"
                    type="number"
                    placeholder="Número"
                    value={formData.numero}
                    onChange={(e) => handleInputChange("numero", e.target.value)}
                    required
                    className="h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="complemento" className="text-base font-semibold text-gray-700">Complemento</Label>
                  <Input
                    id="complemento"
                    placeholder="Complemento"
                    value={formData.complemento}
                    onChange={(e) => handleInputChange("complemento", e.target.value)}
                    className="h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="bairro" className="text-base font-semibold text-gray-700">Bairro</Label>
                  <Input
                    id="bairro"
                    placeholder="Bairro"
                    value={formData.bairro}
                    onChange={(e) => handleInputChange("bairro", e.target.value)}
                    required
                    className="h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="cidade_alu" className="text-base font-semibold text-gray-700">Cidade</Label>
                  <Input
                    id="cidade_alu"
                    placeholder="Cidade"
                    value={formData.cidade_alu}
                    onChange={(e) => handleInputChange("cidade_alu", e.target.value)}
                    required
                    className="h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="uf" className="text-base font-semibold text-gray-700">UF</Label>
                  <Select value={formData.uf} onValueChange={(value) => handleInputChange("uf", value)}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-green-500 rounded-xl">
                      <SelectValue placeholder="-- Selecione --" />
                    </SelectTrigger>
                    <SelectContent>
                      {estados.map((estado) => (
                        <SelectItem key={estado.value} value={estado.value}>
                          {estado.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full btn-modern bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processando matrícula...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-5 w-5" />
                  Finalizar Matrícula
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationForm;
