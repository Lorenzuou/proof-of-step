# Step Competition DApp

Este projeto é uma aplicação descentralizada (DApp) que incentiva as pessoas a caminharem mais em vez de usarem carros ou motos, utilizando a tecnologia blockchain para garantir a autenticidade e imutabilidade das atividades registradas.

## Visão Geral

A DApp funciona como uma competição gamificada de passos, onde os usuários:
- Registram-se em competições
- Registram seus passos diários
- Competem por posições em um ranking transparente e imutável
- Podem visualizar seu progresso em tempo real

## Tecnologias Utilizadas

- React.js para o frontend
- Solidity para os smart contracts
- Hardhat como ambiente de desenvolvimento Ethereum
- ethers.js para interação com a blockchain
- MetaMask para autenticação de usuário

## Estrutura do Projeto

O projeto utiliza dois contratos principais:
1. `StepCompetition.sol` - Gerencia uma competição individual
2. `CompetitionFactory.sol` - Permite criar múltiplas competições

### Factory Pattern

O Contract Factory é usado para criar contratos individuais para cada competição, permitindo:
- Isolamento entre diferentes competições
- Regras personalizadas por competição
- Escalabilidade para criar novas competições sem afetar as existentes

### Events

Os Events são utilizados para atualizar o frontend em tempo real:
- `ParticipantRegistered` - Emitido quando um usuário se registra
- `StepsRegistered` - Emitido quando passos são registrados
- `CompetitionCreated` - Emitido quando uma nova competição é criada

## Como executar o projeto

### Pré-requisitos

- Node.js v14+ e npm
- MetaMask instalado no navegador

### Configuração

1. Clone o repositório
   ```
   git clone <URL_DO_REPOSITÓRIO>
   cd step-competition-dapp
   ```

2. Instale as dependências
   ```
   npm install
   ```

3. Compile os contratos
   ```
   npx hardhat compile
   ```

4. Inicie uma rede local Hardhat
   ```
   npx hardhat node
   ```

5. Em um novo terminal, implante os contratos na rede local
   ```
   npx hardhat run scripts/deploy.js --network localhost
   ```
   
   Anote o endereço do contrato `CompetitionFactory` que será exibido no console.

6. Atualize o arquivo `src/App.js` com o endereço do contrato Factory
   ```javascript
   const FACTORY_ADDRESS = "0x..."; // Substitua pelo endereço obtido no passo anterior
   ```

7. Inicie a aplicação React
   ```
   npm start
   ```

8. Conecte o MetaMask à rede local Hardhat:
   - Abra o MetaMask
   - Adicione uma nova rede com os seguintes parâmetros:
     - Network Name: Hardhat
     - New RPC URL: http://127.0.0.1:8545
     - Chain ID: 1337
     - Currency Symbol: ETH

9. Importe uma conta da rede local Hardhat para o MetaMask:
   - Copie a chave privada de uma das contas mostradas no terminal rodando o nó Hardhat
   - No MetaMask, clique em "Importar Conta" e cole a chave privada

10. Acesse a aplicação em `http://localhost:3000`

## Funcionalidades

- Criar novas competições
- Registrar-se em competições existentes
- Registrar passos diários
- Visualizar ranking em tempo real
- Acompanhar progresso pessoal

## Próximos Passos

- Implementar sistema de recompensas
- Adicionar verificação de dados via oráculos
- Integrar com dispositivos de fitness
- Criar interface para administração de competições