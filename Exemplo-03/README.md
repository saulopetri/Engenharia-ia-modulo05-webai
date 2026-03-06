# Web AI Demo

Aplicação web que utiliza **APIs nativas de IA do Chrome (Gemini Nano / Prompt API)** para responder perguntas do usuário, com suporte a **imagem e áudio como entrada** e **tradução automática para português**.

O projeto segue uma arquitetura simples inspirada em **MVC**, separando responsabilidades entre **Services, Controllers e View**.

## Contexto acadêmico
Este projeto faz parte de um conjunto de **exemplos de aplicações apresentados durante a pós-graduação**, demonstrados pelo professor **Erick Wendel**.

O objetivo é mostrar na prática como utilizar **APIs modernas de Inteligência Artificial diretamente no navegador**, explorando recursos experimentais do Chrome e boas práticas de organização de código em aplicações web.

## Objetivo
Demonstrar o uso das **Web AI APIs experimentais do Chrome** diretamente no navegador, sem backend, incluindo:
- geração de respostas com modelo local
- streaming de resposta
- envio de imagem ou áudio
- tradução automática para português
- controle de parâmetros do modelo

## Tecnologias utilizadas
- JavaScript (ES Modules)
- HTML + CSS
- Chrome Web AI APIs:
  - LanguageModel (Gemini Nano)
  - Translator API
  - Language Detection API
- http-server para servir os arquivos
- Dev Containers (ambiente de desenvolvimento isolado)

## Requisitos
Funciona apenas em **Google Chrome ou Chrome Canary com flags ativadas**.

Ativar em `chrome://flags`:

- Prompt API for Gemini Nano
- Translation API
- Language Detection API

Após ativar, reinicie o navegador.

## Como executar
1. Instale dependências

npm install

2. Execute o servidor

npm start

3. Abra no navegador

http://localhost:8080

## Estrutura do projeto

index.html
Interface principal da aplicação.

index.js
Ponto de entrada. Inicializa serviços, view e controller.

controllers/  
formController.js  
Responsável por controlar o fluxo do formulário e interação do usuário.

services/  
aiService.js  
Gerencia interação com a API de modelo de linguagem do Chrome.

translationService.js
Gerencia tradução e detecção de idioma.

views/
view.js
Responsável pela manipulação do DOM.

generate-devcontainer.js
Script utilizado para gerar automaticamente a configuração do container com base nas dependências definidas no `package.json`.

.devcontainer/
Configuração do ambiente de desenvolvimento com **Dev Containers** (gerada automaticamente).

style.css  
Estilos da interface.

## Fluxo da aplicação

1. Usuário clica em **Iniciar Conversa**.
2. A aplicação:
   - verifica suporte às APIs
   - inicializa tradução
   - carrega parâmetros do modelo
3. Usuário digita pergunta ou envia imagem/áudio.
4. Controller envia dados para o **AIService**.
5. O modelo responde em **streaming**.
6. A resposta é exibida em tempo real.
7. Ao final, o texto é **traduzido para português**.

## Parâmetros do modelo

Temperature
Controla criatividade das respostas.

- valores baixos → respostas mais determinísticas
- valores altos → respostas mais criativas

TopK
Limita a seleção às K palavras mais prováveis.

- valores baixos → respostas mais previsíveis

## Suporte a arquivos

É possível anexar:

- imagens
- áudio

O arquivo é enviado junto com o prompt para o modelo.

A interface mostra uma **pré-visualização do arquivo** antes do envio.

## Streaming de resposta

A API `promptStreaming()` retorna chunks de texto.

A aplicação concatena os chunks para mostrar a resposta sendo gerada em tempo real.

## Tradução automática

Após a geração da resposta:

1. O idioma é detectado com `LanguageDetector`.
2. Se não for português, a resposta é traduzida usando `Translator`.
3. A tradução é feita também em **streaming**.

## Arquitetura

Controller
Controla fluxo da aplicação e eventos do formulário.

Service
Encapsula comunicação com APIs externas (IA e tradução).

View
Manipula DOM e interface do usuário.

Essa separação facilita manutenção e evolução do projeto.

## Ambiente de desenvolvimento

O projeto foi atualizado para utilizar **Dev Containers**, permitindo que o ambiente de desenvolvimento seja reproduzido facilmente em qualquer máquina.

As adaptações para suporte a Dev Containers e automação da configuração do ambiente foram realizadas por **Saulo Petri**.

A configuração do container é gerada automaticamente através do script:

`generate-devcontainer.js`

Esse script cria o arquivo de configuração do Dev Container com base nas dependências definidas no `package.json`, facilitando a configuração do ambiente para quem for executar ou estudar o projeto.

## Créditos

Exemplo original apresentado pelo professor **Erick Wendel** durante a pós-graduação.

Adaptações, melhorias de documentação e suporte a **Dev Containers** por **Saulo Petri**.

## Observações

As Web AI APIs ainda são **experimentais** e podem mudar.

O modelo é executado **localmente no navegador**, sem necessidade de servidor de IA.

Isso permite aplicações com:

- maior privacidade
- menor latência
- funcionamento offline (após download do modelo).
