import React from 'react';
import { Facebook, Instagram, Youtube, MapPin, Globe, Church } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Sistema */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Sistema</h3>
            <div className="bg-white p-3 rounded-lg">
              <p className="text-blue-900 font-semibold text-sm">
                Sistema de Controle de Alunos
              </p>
            </div>
          </div>

          {/* Ministério */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Ministério</h3>
            <div className="bg-white p-3 rounded-lg space-y-2">
              <div className="flex items-center space-x-2">
                <Church className="h-4 w-4 text-blue-900" />
                <span className="text-blue-900 font-medium text-sm">
                  Assembléia de Deus Ministério Missão
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-blue-900" />
                <a 
                  href="https://admissaoprv.com.br/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-900 hover:text-blue-700 transition-colors font-medium text-sm"
                >
                  admissaoprv.com.br
                </a>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Endereço</h3>
            <div className="bg-white p-3 rounded-lg">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-blue-900 mt-1 flex-shrink-0" />
                <div className="text-blue-900 text-sm">
                  <p className="font-medium">ASR-SE 75, Alameda 2, Lote 53</p>
                  <p>Plano Diretor Sul</p>
                  <p>Palmas-Tocantins – Brasil</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subnúcleos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Subnúcleos</h3>
            <div className="bg-white p-3 rounded-lg">
              <div className="text-blue-900 text-sm space-y-1">
                <p>1 - ARNO 44</p>
                <p>2 - Sede</p>
                <p>3 - Aureny III</p>
                <p>4 - Taquarí</p>
                <p>5 - Morada do Sol II</p>
                <p>6 - Luzimanges</p>
                <p>7 - Colinas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Redes Sociais */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">Redes Sociais</h3>
          <div className="bg-white p-4 rounded-lg">
            <div className="flex justify-center space-x-6">
              <a 
                href="https://www.facebook.com/missaoprvidas" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-900 hover:text-blue-700 transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="font-medium">Facebook</span>
              </a>
              <a 
                href="https://www.instagram.com/admissaoprv.oficial" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-900 hover:text-blue-700 transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="font-medium">Instagram</span>
              </a>
              <a 
                href="https://www.youtube.com/c/ADMiss%C3%A3oPRV" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-900 hover:text-blue-700 transition-colors"
              >
                <Youtube className="h-5 w-5" />
                <span className="font-medium">YouTube</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-blue-700 mt-8 pt-6">
          <div className="text-center">
            <p className="text-sm text-blue-100">
              © 2025 EETAD - Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;