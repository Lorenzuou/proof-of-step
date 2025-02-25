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

   function getRanking() external view returns (address[] memory, uint256[] memory) {
    // Handle empty case
    if (participantAddresses.length == 0) {
        return (new address[](0), new uint256[](0));
    }
    
    // Create copies to avoid modifying storage
    address[] memory rankedUsers = new address[](participantAddresses.length);
    uint256[] memory rankedSteps = new uint256[](participantAddresses.length);
    
    // Copy data first
    for (uint256 i = 0; i < participantAddresses.length; i++) {
        rankedUsers[i] = participantAddresses[i];
        rankedSteps[i] = participants[participantAddresses[i]].steps;
    }
    
    // Simple bubble sort (more efficient sorts could be implemented)
    if (rankedUsers.length > 1) {
        for (uint256 i = 0; i < rankedUsers.length - 1; i++) {
            for (uint256 j = 0; j < rankedUsers.length - i - 1; j++) {
                if (rankedSteps[j] < rankedSteps[j + 1]) {
                    // Swap steps
                    uint256 tempSteps = rankedSteps[j];
                    rankedSteps[j] = rankedSteps[j + 1];
                    rankedSteps[j + 1] = tempSteps;
                    
                    // Swap addresses
                    address tempAddr = rankedUsers[j];
                    rankedUsers[j] = rankedUsers[j + 1];
                    rankedUsers[j + 1] = tempAddr;
                }
            }
        }
    }
    
    return (rankedUsers, rankedSteps);
}
}