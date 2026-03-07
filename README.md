# Web AI — Inteligência Artificial no Navegador

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)
![Node.js](https://img.shields.io/badge/node-%3E%3D18-green?logo=node.js)
![WebAI](https://img.shields.io/badge/AI-WebAI-purple)
![Gemini Nano](https://img.shields.io/badge/AI-Gemini%20Nano-blueviolet)
![DevContainer](https://img.shields.io/badge/devcontainer-ready-blue)

Repositório com exemplos práticos de **Inteligência Artificial executada diretamente no navegador**, utilizando APIs experimentais de Web AI do Chrome.

---

## 📋 Sobre este repositório

Este repositório reúne projetos desenvolvidos durante a pós‑graduação em **Engenharia/Desenvolvimento de Software com foco em IA aplicada à Web**.

Os exemplos demonstram como utilizar **modelos de linguagem locais no navegador** (Gemini Nano) através da API experimental `LanguageModel`, com streaming de respostas e renderização em Markdown.

**Professor responsável pelos exemplos originais:** Erick Wendel  
**Adaptações, experimentos e documentação:** Saulo Petri

---

## 🎯 Objetivos de aprendizado

Ao explorar estes exemplos, você aprenderá a:

- Criar sessões de IA diretamente no navegador
- Processar streaming de tokens de resposta
- Construir interfaces interativas com IA client‑side
- Trabalhar com APIs experimentais de Web AI
- Organizar código com padrões como MVC
- Utilizar Dev Containers para ambientes padronizados

---

## 📦 Estrutura do repositório

```
.
├── Exemplo-01/
│   └── Demo simples com LanguageModel API
├── Exemplo-02/
│   └── Aplicação web com controles de parâmetros
├── Exemplo-03/
│   └── App com MVC, suporte a imagem/áudio e tradução
└── README.md
```

Cada exemplo é um projeto independente com seu próprio README detalhado.

---

## 📚 Descrição dos exemplos

### Exemplo 01 — LanguageModel API Básico

**Caminho:** [`Exemplo-01/`](Exemplo-01/)

Demo minimalista que mostra:

- Criação de sessão com `LanguageModel.create()`
- Envio de prompt e recebimento de resposta via streaming
- Renderização de Markdown em tempo real
- Interface HTML pura (sem frameworks)

**Arquivo principal:** [`index.html`](Exemplo-01/index.html)

Ideal para entender os conceitos fundamentais da API.

---

### Exemplo 02 — Web AI com Controles

**Caminho:** [`Exemplo-02/`](Exemplo-02/)

Aplicação mais completa com:

- Controles de **temperature** e **topK**
- Botão para interromper geração
- **Interação por voz** usando Web Speech API
- Servidor local com `http-server`
- Configuração com **Dev Containers**
- Interface com tema escuro

**Arquivos principais:** [`index.html`](Exemplo-02/index.html), [`index.js`](Exemplo-02/index.js), [`style.css`](Exemplo-02/style.css), [`components/VoiceRecorder.js`](Exemplo-02/components/VoiceRecorder.js), [`components/VoiceRecorder.css`](Exemplo-02/components/VoiceRecorder.css)

#### Componente VoiceRecorder

O componente [`VoiceRecorder.js`](Exemplo-02/components/VoiceRecorder.js) encapsula a funcionalidade de reconhecimento de voz usando a **Web Speech API**, fornecendo uma interface simples com:

- **Transcrição contínua** e resultados intermediários
- **Suporte a múltiplos idiomas** (configurável)
- **Callbacks** para eventos: `onStart`, `onResult`, `onEnd`, `onError`
- **Controle** de gravação: `start()`, `stop()`, `toggle()`, `clear()`
- **Integração** com o campo de texto da aplicação

O componente é reutilizável e pode ser facilmente adaptado para outros projetos que necessitem de entrada por voz no navegador.

Demonstra como gerenciar parâmetros e ciclo de vida da sessão, além de integrar reconhecimento de voz.

---

### Exemplo 03 — MVC com Multimodalidade

**Caminho:** [`Exemplo-03/`](Exemplo-03/)

Projeto com arquitetura MVC e recursos avançados:

- Separação em **Services**, **Controllers** e **Views**
- Suporte a **imagem** e **áudio** como entrada
- **Tradução automática** para português
- Detecção automática de idioma
- Streaming de resposta e tradução
- **Gravação de voz** integrada com botão de microfone
- **Preview de arquivos** anexados (imagens e áudios)

**Arquivos principais:** [`index.js`](Exemplo-03/index.js), [`controllers/formController.js`](Exemplo-03/controllers/formController.js), [`services/aiService.js`](Exemplo-03/services/aiService.js), [`services/translationService.js`](Exemplo-03/services/translationService.js), [`views/view.js`](Exemplo-03/views/view.js), [`components/VoiceRecorder.js`](Exemplo-03/components/VoiceRecorder.js), [`components/VoiceRecorder.css`](Exemplo-03/components/VoiceRecorder.css)

#### Componente VoiceRecorder

O componente [`VoiceRecorder.js`](Exemplo-03/components/VoiceRecorder.js) fornece funcionalidade de gravação de voz usando a **MediaRecorder API**, com:

- **Gravação de áudio** diretamente no navegador
- **Interface visual** com botão de microfone e animação de gravação
- **Integração** com o formulário como arquivo anexado
- **Callbacks** para eventos: `onStart`, `onStop`, `onError`
- **Controle** de gravação: `start()`, `stop()`, `toggle()`
- **Formato** de saída: arquivo WebM otimizado para envio à IA

Exemplo mais avançado, mostrando organização de código e uso de múltiplas APIs.

---

## ⚙️ Requisitos do navegador

Todos os exemplos dependem de **APIs experimentais do Chrome**.

### Navegador necessário

- Google Chrome (versão estável recente) **ou**
- Chrome Canary

### Flags a ativar

Acesse `chrome://flags` e ative:

- **Prompt API for Gemini Nano**
- **Translation API** (necessário apenas para Exemplo 03)
- **Language Detection API** (necessário apenas para Exemplo 03)

Após ativar, **reinicie o navegador**.

Na primeira execução, o modelo pode ser baixado automaticamente pelo Chrome.

---

## 🚀 Como executar

### Para qualquer exemplo:

1. Acesse a pasta do exemplo
2. Instale as dependências (se houver `package.json`):

   ```bash
   npm install
   ```

3. Inicie o servidor local:

   ```bash
   npm start
   ```

4. Abra no navegador:

   ```
   http://localhost:8080
   ```

5. Para Exemplo 01, basta abrir o `index.html` diretamente (não requer servidor).

### Usando Dev Containers (opcional)

Os exemplos 02 e 03 incluem configuração para **Dev Containers**:

- Instale a extensão **Dev Containers** no VS Code
- Abra a pasta do projeto
- Clique em "Reopen in Container"
- O ambiente será configurado automaticamente

O script [`generate-devcontainer.js`](Exemplo-02/generate-devcontainer.js) gera a configuração do container a partir do `package.json`.

---

## 🔧 Tecnologias utilizadas

- **HTML5** e **CSS3**
- **JavaScript** (ES Modules)
- **Chrome Web AI APIs**:
  - `LanguageModel` (Gemini Nano)
  - `Translator`
  - `LanguageDetector`
- **Web Speech API** (reconhecimento de voz)
- **Markdown.js** (via CDN)
- **http-server** (para servir arquivos localmente)
- **Dev Containers** (opcional, para ambiente padronizado)

---

## 📝 Contexto acadêmico

Este material foi desenvolvido durante estudos de pós‑graduação, com exemplos originais apresentados em aula pelo professor **Erick Wendel**.

As adaptações, experimentos e documentação foram realizados por **Saulo Petri**, com foco em:

- Consolidação dos conceitos de Web AI
- Organização de código para aprendizado
- Documentação clara e reprodutível
- Suporte a ambientes de desenvolvimento padronizados

---

## ⚠️ Observações importantes

- As APIs de Web AI são **experimentais** e podem mudar
- Funcionam apenas em **Chrome/Chromium** com flags ativadas
- O processamento é **local** no navegador (sem backend)
- Após o download do modelo, funciona **offline**
- Projetos com fins **educacionais** — não recomendados para produção

---

## 📄 Licença

Repositório disponibilizado para fins **educacionais e de estudo**.

Caso reutilize partes do código, mantenha os créditos apropriados aos autores.

---

## 🤝 Contribuições

Este é um material de estudo. Sugestões e melhorias são bem‑vindas via issues ou pull requests.

---

## ⭐ Curta este repositório

Se estes exemplos foram úteis para seus estudos, considere dar uma estrela ⭐ — isso ajuda outros estudantes a encontrarem o material.
