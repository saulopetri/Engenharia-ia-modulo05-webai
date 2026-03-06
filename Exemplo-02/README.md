# Web AI Demo

![Node](https://img.shields.io/badge/node-%3E%3D18-green)
![DevContainer](https://img.shields.io/badge/devcontainer-ready-blue)
![JavaScript](https://img.shields.io/badge/javascript-ES%20Modules-yellow)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

Uma aplicação web simples que demonstra o uso da **API nativa de IA do navegador (Prompt API / Gemini Nano)** diretamente no cliente, sem necessidade de backend.

O projeto permite que o usuário converse com um **modelo de linguagem executado localmente no navegador**, ajustando parâmetros de geração como *temperature* e *top‑k*.

Todo o processamento acontece no próprio dispositivo do usuário utilizando recursos experimentais do Chrome.

## ✨ Funcionalidades

- Interface web simples para enviar perguntas a um modelo de IA
- Controle de parâmetros de geração da resposta
- Respostas geradas em **streaming**
- Execução local no navegador usando a **API LanguageModel**
- Possibilidade de interromper a geração da resposta

## 🧰 Tecnologias utilizadas

- HTML
- CSS
- JavaScript (ES Modules)
- API experimental do Chrome: **Prompt API / Gemini Nano**
- **http-server** para rodar o projeto localmente
- **Dev Containers** para padronização do ambiente de desenvolvimento

## 📁 Estrutura do projeto

- **index.html**
  Estrutura da interface da aplicação, incluindo o formulário de pergunta e controles de parâmetros.

- **style.css**
  Estilização da interface com tema escuro e layout responsivo.

- **index.js**
  Lógica da aplicação:
  - gerenciamento da sessão de IA
  - comunicação com a API LanguageModel
  - envio de prompts
  - streaming da resposta
  - controle de parâmetros (*temperature* e *topK*)
  - controle de cancelamento da geração

- **package.json**
  Define o script para iniciar um servidor local utilizando **http-server**.

- **generate-devcontainer.js**
  Script que gera automaticamente a configuração do Dev Container com base nas dependências do `package.json`.

- **.devcontainer/**
  Configuração do ambiente de desenvolvimento (gerada automaticamente).

## ⚙️ Requisitos

Este projeto depende de recursos experimentais do navegador.

Você precisa de:

- **Google Chrome ou Chrome Canary** recente
- Ativar a flag:

chrome://flags/#prompt-api-for-gemini-nano

Depois reinicie o navegador.

Na primeira execução o modelo pode precisar ser baixado automaticamente pelo Chrome.

## 🚀 Como executar o projeto

1. Instale as dependências:

npm install

2. Inicie o servidor local:

npm start

3. Abra no navegador:

http://localhost:8080

## 🧪 Como usar

1. Ajuste os parâmetros de geração:
   - **Temperature**: controla criatividade da resposta
   - **Top K**: limita a escolha às palavras mais prováveis

2. Digite sua pergunta no campo de texto.

3. Clique em **Enviar** para gerar a resposta.

4. Durante a geração você pode clicar em **Parar** para interromper o processo.

## 🧠 Como funciona

A aplicação utiliza a **API experimental LanguageModel** do navegador para criar uma sessão de IA local.

Fluxo principal:

1. O usuário envia uma pergunta.
2. A aplicação cria uma sessão do modelo com os parâmetros selecionados.
3. O prompt é enviado ao modelo.
4. A resposta é recebida em **streaming**.
5. Cada trecho da resposta é exibido progressivamente na interface.

Todo o processamento ocorre **localmente no dispositivo do usuário**.

## 📚 Contexto

Este é um dos projetos de exemplo apresentados durante minha **pós-graduação**, nas aulas do professor **Erick Wendel**.

O projeto foi posteriormente atualizado para utilizar **Dev Containers**, facilitando a padronização do ambiente de desenvolvimento.

Para isso foi utilizada a extensão **Dev Containers** do VS Code juntamente com o script **generate-devcontainer.js**, responsável por gerar automaticamente o arquivo de configuração do container com base nas dependências definidas no **package.json**.

## ⚠️ Observações

- O projeto funciona apenas em navegadores que suportam a **Prompt API**.
- A API ainda é **experimental** e pode mudar no futuro.

## Créditos

Exemplo original apresentado pelo professor **Erick Wendel** durante a pós-graduação.
Adaptações, melhorias de documentação e suporte a **Dev Containers** por **Saulo Petri**.

## 🔄 Atualizações do projeto

- Configuração de ambiente de desenvolvimento com **Dev Containers**
- Uso do script **generate-devcontainer.js** para gerar automaticamente a configuração do container a partir do **package.json**
- Execução do projeto em ambientes padronizados e reproduzíveis

## 📄 Licença

Este projeto é destinado a fins educacionais.

Se desejar reutilizar o código, recomenda-se adicionar uma licença como **MIT**.

