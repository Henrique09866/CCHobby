

# CCHobby - Dashboard de Rotina e Hábitos

## Visão Geral
Um dashboard pessoal para acompanhamento diário de hábitos e metas, com visual limpo, cores suaves (bege, laranja claro, roxo claro) e totalmente responsivo.

## Design
- Paleta de cores suaves: bege (#F5F0EB), laranja claro (#F4A261), roxo claro (#B8A9C9), tons neutros
- Cards com sombras leves e bordas arredondadas
- Ícones minimalistas (Lucide)
- Animações suaves nos gráficos e transições

## Funcionalidades

### 1. Header e Navegação
- Logo "CCHobby" com saudação personalizada
- Layout em dashboard de página única

### 2. Resumo Geral (Cards no topo)
- Progresso geral do mês (%)
- Hábitos concluídos no mês
- Sequência atual (streak)
- Maior sequência já alcançada
- Ícones e cores distintas para cada card

### 3. Calendário Dinâmico
- Seleção de mês e ano com botões de navegação
- Grade de dias do mês selecionado
- Ao clicar em um dia, abrir painel para marcar/desmarcar hábitos como concluídos
- Indicador visual de progresso em cada dia (cores ou ícones)
- Os dados persistem ao trocar de mês (armazenados em localStorage)

### 4. Gráfico de Linhas (Recharts)
- Evolução da produtividade ao longo dos dias do mês
- Eixo X: dias | Eixo Y: % de hábitos concluídos
- Atualização automática conforme dados do calendário
- Animação suave ao carregar

### 5. Gráfico de Pizza (Recharts)
- Distribuição de conclusão por hábito no mês
- Cada fatia = um hábito com porcentagem
- Cores distintas e legenda clara

### 6. Metas do Mês
- Seção com cards para cada meta
- Adicionar novas metas com campo de texto
- Editar e remover metas existentes
- Checkbox para marcar meta como atingida

### 7. Persistência de Dados
- Todos os dados salvos em localStorage (sem backend)
- Hábitos, metas e progresso mantidos entre sessões

### 8. Responsividade
- Layout em grid que se adapta: 2-3 colunas no desktop, coluna única no mobile
- Calendário e gráficos redimensionáveis

