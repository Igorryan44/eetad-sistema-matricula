# 🎯 Configuração Específica para Sistema-eetad-Palmas
# Repositório: https://github.com/simiao2025/Sistema-eetad-Palmas.git
# Autor: simacjr@hotmail.com

Write-Host "🎯 Configuração para Sistema EETAD Palmas" -ForegroundColor Cyan
Write-Host "Repositório: https://github.com/simiao2025/Sistema-eetad-Palmas.git"
Write-Host "=============================================="
Write-Host ""

# Verificar status atual
Write-Host "📋 Status Atual:" -ForegroundColor Yellow
Write-Host "Remotes configurados:"
git remote -v
Write-Host ""
Write-Host "Branch atual:"
git branch --show-current
Write-Host ""

# Definir variáveis
$REPO_DESTINO = "https://github.com/simiao2025/Sistema-eetad-Palmas.git"
$USUARIO_DESTINO = "simiao2025"
$NOME_REPO = "Sistema-eetad-Palmas"

Write-Host "🔧 Opções de Colaboração:" -ForegroundColor Yellow
Write-Host "1) Colaborador Direto (se você tem permissão)"
Write-Host "2) Fork + Pull Request (recomendado)"
Write-Host "3) Verificar se você já tem acesso"
Write-Host "4) Apenas visualizar configuração"
Write-Host ""

$choice = Read-Host "Escolha uma opção (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "👥 Configurando como Colaborador Direto..." -ForegroundColor Green
        
        Write-Host "⚠️ VERIFICAÇÃO IMPORTANTE:" -ForegroundColor Yellow
        Write-Host "Você precisa ter sido adicionado como colaborador pelo usuário 'simiao2025'"
        Write-Host "Se não tiver permissão, o push falhará com erro 403."
        Write-Host ""
        
        $confirmar = Read-Host "Tem certeza que tem permissão de colaborador? (s/n)"
        
        if ($confirmar -eq "s") {
            Write-Host "Configurando remote..."
            
            # Backup do remote atual
            $currentRemote = git remote get-url origin 2>$null
            if ($currentRemote) {
                Write-Host "📝 Backup do remote atual: $currentRemote"
            }
            
            # Remover e reconfigurar remote
            try {
                git remote remove origin 2>$null
                Write-Host "✅ Remote 'origin' removido"
            } catch {
                Write-Host "ℹ️ Nenhum remote 'origin' para remover"
            }
            
            # Adicionar novo remote
            git remote add origin $REPO_DESTINO
            Write-Host "✅ Adicionado: $REPO_DESTINO"
            
            # Verificar se há commits para enviar
            $hasCommits = git log --oneline 2>$null
            if ($hasCommits) {
                Write-Host ""
                Write-Host "📤 Fazendo push para o repositório..."
                try {
                    git push -u origin main
                    Write-Host ""
                    Write-Host "🎉 Sucesso! Código enviado para Sistema-eetad-Palmas" -ForegroundColor Green
                    Write-Host "Acesse: https://github.com/simiao2025/Sistema-eetad-Palmas"
                } catch {
                    Write-Host ""
                    Write-Host "❌ Erro no push!" -ForegroundColor Red
                    Write-Host "Possíveis causas:"
                    Write-Host "- Você não tem permissão de colaborador"
                    Write-Host "- Problemas de autenticação"
                    Write-Host "- Conflitos no repositório"
                    Write-Host ""
                    Write-Host "💡 Sugestão: Tente a opção 2 (Fork + Pull Request)"
                    
                    # Restaurar remote anterior se existir
                    if ($currentRemote) {
                        git remote remove origin 2>$null
                        git remote add origin $currentRemote
                        Write-Host "🔄 Remote anterior restaurado"
                    }
                }
            } else {
                Write-Host "⚠️ Nenhum commit encontrado para enviar"
            }
        } else {
            Write-Host "❌ Operação cancelada." -ForegroundColor Red
        }
    }
    "2" {
        Write-Host ""
        Write-Host "🍴 Configurando Fork + Pull Request..." -ForegroundColor Green
        
        $seuUsuario = Read-Host "Digite seu usuário GitHub"
        $seuFork = "https://github.com/$seuUsuario/$NOME_REPO.git"
        
        Write-Host ""
        Write-Host "📝 Instruções para Fork:" -ForegroundColor Cyan
        Write-Host "1. Acesse: https://github.com/simiao2025/Sistema-eetad-Palmas"
        Write-Host "2. Clique no botão 'Fork' (canto superior direito)"
        Write-Host "3. Isso criará uma cópia em: https://github.com/$seuUsuario/$NOME_REPO"
        Write-Host ""
        
        $abrirBrowser = Read-Host "Deseja abrir o repositório no navegador para fazer fork? (s/n)"
        if ($abrirBrowser -eq "s") {
            Start-Process "https://github.com/simiao2025/Sistema-eetad-Palmas"
        }
        
        Write-Host ""
        $forkFeito = Read-Host "Você já fez o fork? (s/n)"
        
        if ($forkFeito -eq "s") {
            Write-Host "Configurando remotes para fork..."
            
            # Remover remote atual
            try {
                git remote remove origin 2>$null
                git remote remove upstream 2>$null
                Write-Host "✅ Remotes anteriores removidos"
            } catch {
                Write-Host "ℹ️ Nenhum remote anterior para remover"
            }
            
            # Configurar fork
            git remote add origin $seuFork
            git remote add upstream $REPO_DESTINO
            Write-Host "✅ Fork configurado como 'origin'"
            Write-Host "✅ Repositório original configurado como 'upstream'"
            
            # Push para fork
            Write-Host ""
            Write-Host "📤 Enviando código para seu fork..."
            try {
                git push -u origin main
                Write-Host ""
                Write-Host "🎉 Código enviado para seu fork!" -ForegroundColor Green
                Write-Host ""
                Write-Host "🔄 Próximos passos para Pull Request:"
                Write-Host "1. Acesse: https://github.com/$seuUsuario/$NOME_REPO"
                Write-Host "2. Clique em 'Compare & pull request'"
                Write-Host "3. Adicione título e descrição das mudanças"
                Write-Host "4. Clique em 'Create pull request'"
                Write-Host ""
                
                $abrirFork = Read-Host "Deseja abrir seu fork no navegador? (s/n)"
                if ($abrirFork -eq "s") {
                    Start-Process "https://github.com/$seuUsuario/$NOME_REPO"
                }
            } catch {
                Write-Host ""
                Write-Host "❌ Erro ao enviar para o fork!" -ForegroundColor Red
                Write-Host "Verifique se o fork foi criado corretamente."
            }
        } else {
            Write-Host "❌ Faça o fork primeiro e execute o script novamente." -ForegroundColor Red
        }
    }
    "3" {
        Write-Host ""
        Write-Host "🔍 Verificando Acesso..." -ForegroundColor Green
        
        Write-Host "Testando acesso ao repositório..."
        try {
            # Tentar fazer um dry-run push
            git ls-remote $REPO_DESTINO HEAD 2>$null
            Write-Host "✅ Repositório acessível para leitura"
            
            # Configurar temporariamente para testar push
            $tempRemote = "temp-test-" + (Get-Random)
            git remote add $tempRemote $REPO_DESTINO 2>$null
            
            try {
                git push --dry-run $tempRemote main 2>$null
                Write-Host "✅ Você tem permissão de escrita (colaborador)" -ForegroundColor Green
                Write-Host "💡 Pode usar a opção 1 (Colaborador Direto)"
            } catch {
                Write-Host "❌ Sem permissão de escrita" -ForegroundColor Yellow
                Write-Host "💡 Use a opção 2 (Fork + Pull Request)"
            } finally {
                git remote remove $tempRemote 2>$null
            }
        } catch {
            Write-Host "❌ Erro ao acessar repositório" -ForegroundColor Red
            Write-Host "Verifique se a URL está correta e se você tem acesso à internet"
        }
    }
    "4" {
        Write-Host ""
        Write-Host "📊 Configuração Atual:" -ForegroundColor Green
        Write-Host ""
        Write-Host "Remotes:"
        git remote -v
        Write-Host ""
        Write-Host "Branch atual:"
        git branch --show-current
        Write-Host ""
        Write-Host "Status:"
        git status --short
        Write-Host ""
        Write-Host "Últimos commits:"
        git log --oneline -5
    }
    default {
        Write-Host "❌ Opção inválida!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "📚 Documentação:" -ForegroundColor Cyan
Write-Host "- COLABORACAO-REPOSITORIO.md - Guia completo"
Write-Host "- Configurar-Colaboracao.ps1 - Script genérico"
Write-Host ""
Write-Host "🎯 Repositório de destino: Sistema-eetad-Palmas"
Write-Host "👤 Proprietário: simiao2025"

# Manter janela aberta
Read-Host "Pressione ENTER para sair"