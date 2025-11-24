# GN Pharmacy 🏥

Bem-vindo ao **GN Pharmacy**, um sistema backend robusto desenvolvido para conectar usuários a farmácias locais. O objetivo principal é permitir que administradores gerenciem o cadastro de farmácias e que usuários finais encontrem medicamentos próximos e recebam recomendações inteligentes via chat com IA.

## 📋 Sobre o Projeto

Este projeto é uma API RESTful que serve como backend para uma plataforma de farmácias. Ele oferece funcionalidades distintas para dois tipos de usuários:

- **Administradores**: Responsáveis pelo cadastro e gerenciamento das farmácias parceiras.
- **Usuários Finais**: Podem se cadastrar, gerenciar seu perfil e utilizar recursos de IA para pesquisar remédios e receber orientações.

## ✨ Funcionalidades

### 👤 Usuários (End-Users)

- **Cadastro e Autenticação**: Registro de conta e login seguro com JWT.
- **Perfil**: Gerenciamento de dados pessoais e endereço.
- **Busca Inteligente (IA)**:
  - **Chat**: Converse com uma IA para tirar dúvidas sobre saúde e medicamentos.
  - **Recomendação de Medicamentos**: Envie mensagens (texto, imagem ou áudio) para receber sugestões de medicamentos baseadas em sintomas ou necessidades.
- **Visualização de Farmácias**: Listagem e detalhes de farmácias cadastradas.

### 🛡️ Administradores (Admin)

- **Gestão de Farmácias**:
  - Cadastrar novas farmácias.
  - Atualizar informações de farmácias existentes.
  - Remover farmácias do sistema.

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando uma stack moderna e escalável:

- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework Web**: [Express](https://expressjs.com/)
- **Banco de Dados**: [Amazon DynamoDB](https://aws.amazon.com/dynamodb/) (via [Dynamoose](https://dynamoosejs.com/))
- **Inteligência Artificial**: [OpenAI API](https://openai.com/) (GPT & Whisper)
- **Armazenamento**: AWS S3 (via AWS SDK)
- **Autenticação**: JWT (JSON Web Tokens) & Bcrypt
- **Containerização**: [Docker](https://www.docker.com/) & Docker Compose

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [Docker](https://www.docker.com/) & Docker Compose
- Uma conta na **AWS** (para DynamoDB e S3 - _ou use o DynamoDB Local via Docker_)
- Uma chave de API da **OpenAI**

## 🔧 Instalação e Configuração

1.  **Clone o repositório**

    ```bash
    git clone https://github.com/seu-usuario/gn-pharmacy.git
    cd gn-pharmacy
    ```

2.  **Instale as dependências**

    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente**
    Copie o arquivo de exemplo `.env.example` para `.env` e preencha com suas credenciais:

    ```bash
    cp .env.example .env
    ```

    > **Importante**: Preencha a `OPENAI_API_KEY` e as credenciais da AWS no arquivo `.env`.

4.  **Inicie o Banco de Dados (Local)**
    Utilize o Docker Compose para subir uma instância local do DynamoDB:

    ```bash
    docker-compose up -d
    ```

5.  **Execute a Aplicação**
    Para iniciar o servidor em modo de desenvolvimento:
    ```bash
    npm run dev
    ```
    O servidor estará rodando em `http://localhost:3000` (ou a porta definida no seu .env).

## 📖 Como Usar

### Autenticação

A maioria das rotas é protegida. Você precisará criar um usuário e fazer login para obter um token JWT.

- `POST /api/user`: Criar nova conta.
- `POST /api/auth/login`: Entrar e receber o token `access_token`.
- **Header**: Adicione `Authorization: Bearer <seu_token>` nas requisições subsequentes.

### Rotas Principais

- **Farmácias (`/api/pharmacy`)**:
  - `GET /`: Listar todas (Aberto/Autenticado).
  - `POST /`: Criar farmácia (Apenas Admin).
- **OpenAI (`/api/openai`)**:
  - `POST /chat`: Chat geral com a IA.
  - `POST /recommendate-medicine`: Envie uma descrição ou áudio para recomendação.

## 📦 Scripts Disponíveis

- `npm run dev`: Inicia o servidor com hot-reload (nodemon).
- `npm run build`: Compila o TypeScript para JavaScript na pasta `dist`.
- `npm start`: Inicia o servidor de produção (requer build prévio).

---

Desenvolvido com 💙 por [Gustavo Neri]
