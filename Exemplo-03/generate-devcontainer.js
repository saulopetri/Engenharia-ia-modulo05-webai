/**
 * Gerador de configuração DevContainer para projetos Node.js
 *
 * Este script lê o package.json do projeto e gera automaticamente
 * um arquivo .devcontainer/devcontainer.json com configurações otimizadas
 * baseadas nas dependências instaladas.
 */

import fs from "fs";
import path from "path";

// Carrega as dependências do package.json
const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"));

// Combina dependências de produção e desenvolvimento
const deps = {
  ...pkg.dependencies,
  ...pkg.devDependencies
};

// Define a versão do Node.js (padrão: 20)
let nodeVersion = "20";

// Usa a versão especificada no package.json se disponível
if (pkg.engines?.node) {
  nodeVersion = pkg.engines.node.replace(/[^\d]/g, "") || "20";
}

// Arrays e objetos para configuração dinâmica
const extensions = [];      // Extensões VS Code recomendadas
const features = {};        // Features do DevContainer
const forwardPorts = [];   // Portas a serem expostas

// Configura portas comuns para frameworks web
if (deps.express || deps.fastify) {
  forwardPorts.push(3000);
}

if (deps.next) {
  forwardPorts.push(3000);
}

if (deps["@nestjs/core"]) {
  forwardPorts.push(3000);
}

// Adiciona features para bancos de dados baseados nas dependências
if (deps.prisma) {
  features["ghcr.io/devcontainers/features/postgres"] = {};
}

if (deps.mongodb || deps.mongoose) {
  features["ghcr.io/devcontainers/features/mongodb"] = {};
}

// Adiciona extensões específicas baseadas nas dependências
if (deps.typescript) {
  extensions.push("ms-vscode.vscode-typescript-next");
}

// Extensões recomendadas para todos os projetos Node.js
extensions.push(
  "dbaeumer.vscode-eslint",
  "esbenp.prettier-vscode"
);

// Obtém o nome do projeto ou usa um valor padrão
const projectName = pkg.name || "node-project";
// Define o caminho do workspace dentro do contêiner
const workspacePath = `/workspaces/${projectName}`;

// Configuração completa do DevContainer
const devcontainer = {
  name: projectName,
  // Monta o workspace local no contêiner
  workspaceMount: `source=${process.env.WORKSPACE_FOLDER || '${localWorkspaceFolder}'},target=${workspacePath},type=bind`,
  workspaceFolder: workspacePath,
  // Imagem base do Node.js
  image: `mcr.microsoft.com/devcontainers/javascript-node:${nodeVersion}`,
  features,
  forwardPorts,
  customizations: {
    vscode: {
      extensions
    }
  },
  // Força o ajuste de UID/GID para evitar problemas de permissão
  updateRemoteUserUID: true,
  // Comando pós-criação: cria node_modules e instala dependências
  postCreateCommand: `mkdir -p node_modules && npm install`
};

// Cria o diretório .devcontainer se não existir
fs.mkdirSync(".devcontainer", { recursive: true });

// Escreve o arquivo devcontainer.json formatado
fs.writeFileSync(
  path.join(".devcontainer", "devcontainer.json"),
  JSON.stringify(devcontainer, null, 2)
);

console.log("✅ .devcontainer criado automaticamente!");