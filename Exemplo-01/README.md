# Browser AI Demo — LanguageModel API

Demonstração simples de uso de **Modelos de Linguagem diretamente no navegador** utilizando a API experimental `LanguageModel`.

Este projeto mostra como criar uma sessão de IA no browser, enviar uma pergunta do usuário e receber a resposta **via streaming de tokens**, renderizando o resultado em **Markdown em tempo real**.

---

## Contexto acadêmico

Este projeto faz parte de **exemplos apresentados durante minha pós‑graduação**, demonstrados em aula pelo professor **Erick Wendel**.

A versão presente neste repositório inclui **adaptações, organização e documentação adicional**.

**Autor original:** Erick Wendel  
**Adaptações e documentação:** Saulo Petri

---

## Demonstração

A aplicação consiste em uma página HTML simples onde o usuário pode digitar uma pergunta e receber uma resposta gerada por IA diretamente no navegador.

Fluxo da aplicação:

1. Usuário digita uma pergunta.
2. Clica no botão **Perguntar**.
3. Uma sessão de modelo de linguagem é criada.
4. A pergunta é enviada ao modelo.
5. A resposta é retornada em **streaming**.
6. Cada token recebido é renderizado como **Markdown → HTML**.

Isso cria uma experiência semelhante à geração de texto em tempo real vista em assistentes de IA.

---

## Estrutura do projeto

```
.
├── index.html
└── README.md
```

Arquivo principal:

- **index.html** — Contém toda a interface e lógica da aplicação.

---

## Tecnologias utilizadas

- HTML5
- JavaScript (Browser API)
- Markdown.js (via CDN)
- API experimental `LanguageModel`

Biblioteca de Markdown utilizada:

https://www.jsdelivr.com/package/npm/markdown

---

## Funcionamento técnico

### 1. Criação da sessão do modelo

Ao clicar no botão, o código cria uma sessão de modelo de linguagem:

```javascript
const session = await LanguageModel.create({
  expectedInputLanguages: ["pt"],
  temperature,
  topK,
  initialPrompts
})
```

Configurações principais:

```
temperature = 1
topK = 3
```

- **temperature** controla a criatividade das respostas
- **topK** limita o conjunto de tokens considerados

---

### 2. Prompt inicial do sistema

O comportamento base da IA é definido por um prompt inicial:

```
Você é um assistente de IA que responde de forma clara e objetiva.
```

---

### 3. Streaming da resposta

A resposta do modelo é recebida gradualmente usando **streaming de tokens**:

```javascript
for await (const token of responseStream) {
  fullText += token
  output.innerHTML = markdown.toHTML(fullText)
}
```

Isso permite que o texto seja exibido progressivamente na interface.

---

## Interface da aplicação

Elementos presentes na página:

- Campo de texto para a pergunta
- Botão **Perguntar**
- Área de saída (`output`) para exibir a resposta

A resposta é renderizada automaticamente como **Markdown convertido para HTML**.

---

## Como executar

1. Abra o arquivo `index.html` em um navegador compatível.
2. Digite uma pergunta no campo de texto.
3. Clique em **Perguntar**.
4. Aguarde a geração da resposta em tempo real.

---

## Observações importantes

- A API `LanguageModel` ainda é **experimental**.
- Pode estar disponível apenas em **navegadores específicos ou versões experimentais**.
- Este projeto tem objetivo **educacional e demonstrativo**.

---

## Possíveis melhorias

Algumas evoluções possíveis para o projeto:

- Histórico de conversa (chat completo)
- Botão para cancelar geração
- Interface estilo chatbot
- Controle de parâmetros pelo usuário
- Indicador visual de geração
- Tratamento de erros mais robusto

---

## Créditos

**Erick Wendel**  
Autor do exemplo original apresentado em aula.

**Saulo Petri**  
Adaptação do projeto e criação da documentação para GitHub.

---

## Licença

Este projeto é disponibilizado para fins **educacionais e de estudo**.

Considere verificar a licença do código original caso seja reutilizado em outros contextos.

---

Se este projeto foi útil para seus estudos, considere ⭐ marcar o repositório.

Isso ajuda outros estudantes a encontrarem o material.

🚀

