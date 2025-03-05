// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./StepCompetition.sol";

contract CompetitionFactory {
    // Competition data structure
    struct CompetitionInfo {
        address competitionAddress;
        string name;
    }
    
    // Lista de informações das competições criadas
    CompetitionInfo[] public competitions;
    
    // Evento para notificar a criação de uma nova competição
    event CompetitionCreated(address competitionAddress, string name);
    
    // Função para criar uma nova competição
    function createCompetition(string memory _name) external {
        // Default name if empty
        string memory competitionName = bytes(_name).length > 0 ? _name : "Unnamed Competition";
        
        // Cria uma nova instância do contrato StepCompetition
        StepCompetition newCompetition = new StepCompetition(competitionName);
        
        // Armazena as informações da nova competição
        competitions.push(CompetitionInfo({
            competitionAddress: address(newCompetition),
            name: competitionName
        }));
        
        // Emite um evento com o endereço e nome da nova competição
        emit CompetitionCreated(address(newCompetition), competitionName);
    }
    
    // Função para obter a lista de competições criadas
    function getCompetitions() external view returns (CompetitionInfo[] memory) {
        return competitions;
    }
    
    // Helper function to get competition addresses only (for backward compatibility)
    function getCompetitionAddresses() external view returns (address[] memory) {
        address[] memory addresses = new address[](competitions.length);
        for (uint i = 0; i < competitions.length; i++) {
            addresses[i] = competitions[i].competitionAddress;
        }
        return addresses;
    }
}