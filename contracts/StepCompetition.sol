// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StepCompetition {
    // Competition name
    string public competitionName;
    
    // Estrutura para armazenar dados do participante
    struct Participant {
        uint256 steps;
        bool registered;
        string name; // Added name field
    }

    // Mapeamento para armazenar os participantes
    mapping(address => Participant) public participants;

    // Lista de endereços dos participantes (para calcular o ranking)
    address[] public participantAddresses;

    // Eventos
    event ParticipantRegistered(address user, string name);
    event StepsRegistered(address user, uint256 steps);
    event ProfileNameUpdated(address user, string newName);

    // Constructor to set competition name
    constructor(string memory _name) {
        competitionName = bytes(_name).length > 0 ? _name : "Unnamed Competition";
    }

    // Função para registrar um usuário na competição
    function register(string memory _name) external {
        require(!participants[msg.sender].registered, "Already registered");
        string memory userName = bytes(_name).length > 0 ? _name : "Anonymous Stepper";
        
        participants[msg.sender] = Participant({
            steps: 0, 
            registered: true,
            name: userName
        });
        
        participantAddresses.push(msg.sender);
        emit ParticipantRegistered(msg.sender, userName);
    }
    
    // Update profile name
    function updateProfileName(string memory _newName) external {
        require(participants[msg.sender].registered, "Not registered");
        string memory newName = bytes(_newName).length > 0 ? _newName : "Anonymous Stepper";
        participants[msg.sender].name = newName;
        emit ProfileNameUpdated(msg.sender, newName);
    }

    // Função para registrar passos
    function registerSteps(uint256 steps) external {
        require(participants[msg.sender].registered, "Not registered");
        participants[msg.sender].steps += steps;
        emit StepsRegistered(msg.sender, steps);
    }

    // Modified to include names in the ranking
    function getRanking() external view returns (address[] memory, uint256[] memory, string[] memory) {
        // Handle empty case
        if (participantAddresses.length == 0) {
            return (new address[](0), new uint256[](0), new string[](0));
        }
        
        // Create copies to avoid modifying storage
        address[] memory rankedUsers = new address[](participantAddresses.length);
        uint256[] memory rankedSteps = new uint256[](participantAddresses.length);
        string[] memory rankedNames = new string[](participantAddresses.length);
        
        // Copy data first
        for (uint256 i = 0; i < participantAddresses.length; i++) {
            rankedUsers[i] = participantAddresses[i];
            rankedSteps[i] = participants[participantAddresses[i]].steps;
            rankedNames[i] = participants[participantAddresses[i]].name;
        }
        
        // Simple bubble sort
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
                        
                        // Swap names
                        string memory tempName = rankedNames[j];
                        rankedNames[j] = rankedNames[j + 1];
                        rankedNames[j + 1] = tempName;
                    }
                }
            }
        }
        
        return (rankedUsers, rankedSteps, rankedNames);
    }
}