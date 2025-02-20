// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./StepCompetition.sol"; // Importa o contrato de competição

contract CompetitionFactory {
    // Lista de endereços dos contratos de competição criados
    address[] public competitions;

    // Evento para notificar a criação de uma nova competição
    event CompetitionCreated(address competitionAddress);

    // Função para criar uma nova competição
    function createCompetition() external {
        // Cria uma nova instância do contrato StepCompetition
        StepCompetition newCompetition = new StepCompetition();
        // Armazena o endereço do novo contrato
        competitions.push(address(newCompetition));
        // Emite um evento com o endereço da nova competição
        emit CompetitionCreated(address(newCompetition));
    }
    // Função para obter a lista de competições criadas
    function getCompetitions() external view returns (address[] memory) {
        return competitions;
    }
}