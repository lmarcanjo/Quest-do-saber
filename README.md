# 🎓 EduQuest — Aprendizado Gamificado com IA & RPG

[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind--CSS-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Google--Gemini-Flash-12B0E8?logo=google-gemini)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**EduQuest** é um aplicativo educacional gamificado inovador que transforma o estudo tradicional em uma jornada emocionante de RPG (Role-Playing Game). Alimentado pela inteligência artificial do **Google Gemini (Flash)**, o EduQuest cria desafios personalizados, narrativas imersivas e perguntas adaptativas em tempo real, moldadas de acordo com o perfil, idade e objetivos do usuário.

---

## 🌟 Funcionalidades Principais

*   **⚡ Desafios Gerados por IA (Gemini - Flash):** As perguntas, explicações e contextos não são estáticos! A IA gera o conteúdo dinamicamente com base nas respostas anteriores, idade, nível de dificuldade e o tema que você escolheu.
*   **⚔️ Modo Aventura (RPG):** Mergulhe em narrativas épicas (ou aventuras leves) onde cada exercício resolvido ajuda a desvendar mistérios, superar obstáculos e progredir na história.
*   **📚 Modo Simples (Foco Rápido):** Ideal para quem deseja praticar de forma direta e sem distrações.
*   **📈 Sistema de Progressão e Recompensas:** Ganhe pontos de experiência (XP), suba de nível, conquiste itens temáticos e monitore seu progresso com nosso sistema de barra de vida (corações).
*   **🛡️ Modo de Segurança (Offline-First):** Se o limite da cota da API ou problemas de conexão ocorrerem, o app ativa automaticamente perguntas predefinidas de alta qualidade para que o aprendizado nunca pare.
*   **🎨 UI Moderna e Fluida:** Uma interface visual incrível desenvolvida com componentes acessíveis da Shadcn UI, ícones refinados da Lucide React e animações fluidas controladas pelo Motion (Framer Motion).

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando as tecnologias mais modernas e robustas do mercado de desenvolvimento web:

*   **[React 19](https://react.dev/):** Biblioteca para construção da interface de forma reativa e performática.
*   **[Vite 6](https://vitejs.dev/):** Ferramenta de build extremamente rápida para o desenvolvimento.
*   **[TypeScript](https://www.typescriptlang.org/):** Tipagem estática para garantir robustez e segurança no código.
*   **[Tailwind CSS v4](https://tailwindcss.com/):** Estilização ágil com classes utilitárias e excelente performance visual.
*   **[@google/genai](https://www.npmjs.com/package/@google/genai):** SDK oficial e moderno do Google para integrar o Gemini AI de forma performática.
*   **[Motion](https://motion.dev/):** Biblioteca oficial para transições de tela e animações de alta fidelidade.
*   **[Shadcn UI](https://ui.shadcn.com/):** Componentes acessíveis e elegantes baseados em Tailwind.

---

## 📂 Estrutura de Pastas

```bash
/
├── src/
│   ├── components/            # Componentes visuais do app
│   │   ├── ui/                # Componentes utilitários de interface (cards, botões, progress, etc.)
│   │   ├── Onboarding.tsx     # Tela inicial de perfil e escolha de caminhos
│   │   └── GameLoop.tsx       # Ciclo de jogo, geração e resposta de desafios
│   ├── services/
│   │   └── geminiService.ts   # Serviço de comunicação direta com o Google Gemini API
│   ├── lib/
│   │   └── utils.ts           # Helpers utilitários de estilos CSS (cn)
│   ├── types.ts               # Tipagens globais do TypeScript (UserProfile, Challenge, etc.)
│   ├── App.tsx                # Gerenciador de estado principal da aplicação
│   ├── index.css              # Estilos globais e importação do Tailwind CSS
│   └── main.tsx               # Ponto de entrada do React
├── components.json            # Configuração de componentes Shadcn UI
├── tsconfig.json              # Configurações do TypeScript
├── vite.config.ts             # Configurações do ecossistema Vite
└── package.json               # Gerenciador de dependências e scripts do app
```

---

## 🚀 Como Executar o Projeto Localmente

Siga o passo a passo abaixo para rodar o EduQuest na sua máquina local:

### 1. Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/eduquest.git
cd eduquest
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto (use o `.env.example` como base) e insira sua chave da API do Gemini:
```env
GEMINI_API_KEY=sua_chave_de_api_aqui
```
*Dica:* Obtenha sua chave gratuita no [Google AI Studio](https://aistudio.google.com/).

### 4. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```
O app estará acessível em: `http://localhost:3000`.

---

## 🔒 Segurança de Chaves & Boas Práticas

Este repositório protege as credenciais sensíveis. Nunca faça commit de suas chaves em arquivos públicos.
*   O arquivo `.env` está configurado no `.gitignore` para nunca ser enviado ao GitHub.
*   As requests são processadas utilizando injeções de variáveis de ambiente gerenciadas no escopo interno do Vite.

---

## 👤 Autor

Desenvolvido por **Luã Martins Arcanjo**:

*   **GitHub:** [github.com/lmarcanjo](https://github.com/lmarcanjo/)
*   **LinkedIn:** [linkedin.com/in/luã-martins-arcanjo-b34500124](https://www.linkedin.com/in/lu%C3%A3-martins-arcanjo-b34500124)

---

## 📜 Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para obter mais informações.

---

<p align="center">Feito com 💙 por Luã Martins Arcanjo para revolucionar a forma como aprendemos!</p>
