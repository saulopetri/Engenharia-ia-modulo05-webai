import fs from "fs";
import path from "path";

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"));

const deps = {
  ...pkg.dependencies,
  ...pkg.devDependencies
};

let nodeVersion = "20";

if (pkg.engines?.node) {
  nodeVersion = pkg.engines.node.replace(/[^\d]/g, "") || "20";
}

const extensions = [];
const features = {};
const forwardPorts = [];

if (deps.express || deps.fastify) {
  forwardPorts.push(3000);
}

if (deps.next) {
  forwardPorts.push(3000);
}

if (deps["@nestjs/core"]) {
  forwardPorts.push(3000);
}

if (deps.prisma) {
  features["ghcr.io/devcontainers/features/postgres"] = {};
}

if (deps.mongodb || deps.mongoose) {
  features["ghcr.io/devcontainers/features/mongodb"] = {};
}

if (deps.typescript) {
  extensions.push("ms-vscode.vscode-typescript-next");
}

extensions.push(
  "dbaeumer.vscode-eslint",
  "esbenp.prettier-vscode"
);

const devcontainer = {
  name: pkg.name || "node-project",
  image: `mcr.microsoft.com/devcontainers/javascript-node:${nodeVersion}`,
  features,
  forwardPorts,
  customizations: {
    vscode: {
      extensions
    }
  },
  postCreateCommand: "npm install"
};

fs.mkdirSync(".devcontainer", { recursive: true });

fs.writeFileSync(
  path.join(".devcontainer", "devcontainer.json"),
  JSON.stringify(devcontainer, null, 2)
);

console.log("✅ .devcontainer criado automaticamente!");