// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StepCompetition {
    // Estrutura para armazenar dados do participante
    struct Participant {
        uint256 steps;
        bool registered;
    }

    // Mapeamento para armazenar os participantes
    mapping(address => Participant) public participants;

    // Lista de endereços dos participantes (para calcular o ranking)
    address[] public participantAddresses;

    // Eventos
    event ParticipantRegistered(address user);
    event StepsRegistered(address user, uint256 steps);

    // Função para registrar um usuário na competição
    function register() external {
        require(!participants[msg.sender].registered, "Already registered");
        participants[msg.sender] = Participant({ steps: 0, registered: true });
        participantAddresses.push(msg.sender);
        emit ParticipantRegistered(msg.sender);
    }

    // Função para registrar passos
    function registerSteps(uint256 steps) external {
        require(participants[msg.sender].registered, "Not registered");
        participants[msg.sender].steps += steps;
        emit StepsRegistered(msg.sender, steps);
    }

    // Função para obter o ranking
    function getRanking() external view returns (address[] memory, uint256[] memory) {
        address[] memory rankedUsers = participantAddresses;
        uint256[] memory rankedSteps = new uint256[](rankedUsers.length);

        // Ordena os participantes por passos (do maior para o menor)
        for (uint256 i = 0; i < rankedUsers.length - 1; i++) {
            for (uint256 j = i + 1; j < rankedUsers.length; j++) {
                if (participants[rankedUsers[i]].steps < participants[rankedUsers[j]].steps) {
                    // Troca as posições
                    (rankedUsers[i], rankedUsers[j]) = (rankedUsers[j], rankedUsers[i]);
                }
            }
        }

        // Preenche o array de passos
        for (uint256 i = 0; i < rankedUsers.length; i++) {
            rankedSteps[i] = participants[rankedUsers[i]].steps;
        }

        return (rankedUsers, rankedSteps);
    }
}