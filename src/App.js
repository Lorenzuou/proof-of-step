// App.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CompetitionFactoryABI from './abis/CompetitionFactory.json';
import StepCompetitionABI from './abis/StepCompetition.json';
import './App.css';

// Contract addresses (replace with your deployed contract address)
const FACTORY_ADDRESS = "0x47a221ffe6e04352208dF78937012f9A45f33837";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [factoryContract, setFactoryContract] = useState(null);
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [competitionContract, setCompetitionContract] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [steps, setSteps] = useState(0);
  const [userAddress, setUserAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState([]);
  const [userName, setUserName] = useState("");
  const [selectedCompetitionName, setSelectedCompetitionName] = useState("");
  const [newCompetitionName, setNewCompetitionName] = useState("");
  const [newProfileName, setNewProfileName] = useState("");

  // Connect to MetaMask and contracts
  useEffect(() => {
    const init = async () => {
      try {
        if (window.ethereum) {
          // Connect to provider first
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          
          // Get signer next
          const signer = provider.getSigner();
          const userAddress = await signer.getAddress();
          
          // Set state
          setProvider(provider);
          setSigner(signer);
          setUserAddress(userAddress);
          
          // Initialize contracts only after setting signer
          const factoryContract = new ethers.Contract(
            FACTORY_ADDRESS,
            CompetitionFactoryABI.abi,
            signer
          );
          setFactoryContract(factoryContract);
          
          // Get competitions last
          await getCompetitions(factoryContract);
        } else {
          console.error("MetaMask not detected!");
          alert("Please install MetaMask to use this DApp");
        }
      } catch (error) {
        console.error("Error initializing application:", error);
      } finally {
        setLoading(false);
      }
    };
    
    init();
  }, []);

  // Listen for contract events
  useEffect(() => {
    if (competitionContract && provider) {  // Make sure provider exists
      try {
        // Listen for StepsRegistered events
        const onStepsRegistered = (user, steps) => {
          console.log(`User ${user} registered ${steps} steps`);
          fetchRanking(); // Update ranking when steps are registered
        };
        
        // Listen for ParticipantRegistered events
        const onParticipantRegistered = (user) => {
          console.log(`User ${user} registered for the competition`);
          checkIfUserRegistered(); // Check if current user is registered
          fetchRanking(); // Update ranking wWhen new participant joins
        };

        // Set up event listeners
        competitionContract.on("StepsRegistered", onStepsRegistered);
        competitionContract.on("ParticipantRegistered", onParticipantRegistered);
        
        // Clean up function
        return () => {
          // Important: Remove event listeners to prevent memory leaks
          competitionContract.off("StepsRegistered", onStepsRegistered);
          competitionContract.off("ParticipantRegistered", onParticipantRegistered);
        };
      } catch (error) {
        console.error("Error setting up event listeners:", error);
      }
    }
  }, [competitionContract, provider]);

  // Get all competitions
  const getCompetitions = async (contract) => {
    try {
      const competitionsInfo = await contract.getCompetitions();
      // Map competitions info to include address and name
      const competitionsWithNames = competitionsInfo.map(comp => ({
        address: comp.competitionAddress,
        name: comp.name
      }));
      setCompetitions(competitionsWithNames);
      
      if (competitionsWithNames.length > 0) {
        // Only select a competition if there's at least one
        selectCompetition(competitionsWithNames[0].address);
      } else {
        // Clear competition-related state when there are no competitions
        setSelectedCompetition(null);
        setSelectedCompetitionName("");
        setCompetitionContract(null);
        setIsRegistered(false);
        setRanking([]);
      }
    } catch (error) {
      console.error("Error fetching competitions:", error);
      // Ensure we reset state on error
      setCompetitions([]);
      setSelectedCompetition(null);
      setSelectedCompetitionName("");
      setCompetitionContract(null);
    }
  };
  const fetchCompetitions = async () => {
    try {
      // Make sure factoryContract is available
      if (!factoryContract) {
        console.log("Factory contract not initialized");
        return;
      }
  
      console.log("Fetching competitions...");
      
      // Get competitions from the factory contract
      const allCompetitions = await factoryContract.getCompetitions();
      
      // Format the competitions data
      const competitionsWithNames = allCompetitions.map(comp => {
        return {
          address: comp.competitionAddress,
          name: comp.name
        };
      });
      
      console.log("Competitions fetched:", competitionsWithNames);
      
      // Update state with the fetched competitions
      setCompetitions(competitionsWithNames);
      
      // If there are competitions, select the first one by default
      if (competitionsWithNames.length > 0) {
        selectCompetition(competitionsWithNames[0].address);
      } else {
        // Clear competition-related state when there are no competitions
        setSelectedCompetition(null);
        setSelectedCompetitionName("");
        setCompetitionContract(null);
        setIsRegistered(false);
        setRanking([]);
      }
    } catch (error) {
      console.error("Error fetching competitions:", error);
      // Ensure we reset state on error
      setCompetitions([]);
      setSelectedCompetition(null);
      setSelectedCompetitionName("");
      setCompetitionContract(null);
    }
  };

  // Create a new competition
  const createCompetition = async () => {
    try {
      console.log("Competition being created...");
      
      // Check if factory contract is available
      if (!factoryContract) {
        console.error("Factory contract not initialized");
        return;
      }
      
      // Get competition name from state or input
      const competitionName = newCompetitionName || "Unnamed Competition";
      
      // Call the factory contract's createCompetition method with the name
      const tx = await factoryContract.createCompetition(competitionName);
      
      // Wait for transaction to be mined
      await tx.wait();
      
      console.log("Competition created successfully!");
      
      // Clear the input field
      setNewCompetitionName("");
      
      // Refresh the competitions list
      fetchCompetitions();
      
    } catch (error) {
      console.error("Error creating competition:", error);
      alert("Failed to create competition: " + error.message);
    }
  };

  // Select a competition to interact with
  const selectCompetition = async (address) => {
    try {
      if (!address) return;
      
      const competitionContract = new ethers.Contract(
        address,
        StepCompetitionABI.abi,
        signer
      );
      
      // Get competition name
      const competitionName = await competitionContract.competitionName();
      
      setSelectedCompetition(address);
      setSelectedCompetitionName(competitionName);
      setCompetitionContract(competitionContract);
      
      // Only check registration and fetch ranking if we have a valid user address
      if (userAddress) {
        await checkIfUserRegistered(competitionContract);
        await fetchRanking(competitionContract);
      }
    } catch (error) {
      console.error("Error selecting competition:", error);
      setSelectedCompetition(null);
      setSelectedCompetitionName("");
      setCompetitionContract(null);
    }
  };

  // Check if user is registered
  const checkIfUserRegistered = async (contract = competitionContract) => {
    try {
      if (contract && userAddress) {
        const participant = await contract.participants(userAddress);
        setIsRegistered(participant.registered);
        if (participant.registered) {
          setUserName(participant.name);
        }
      }
    } catch (error) {
      console.error("Error checking registration status:", error);
    }
  };

  // Register for the competition
  const register = async () => {
    try {
      setLoading(true);
      const tx = await competitionContract.register(newProfileName);
      await tx.wait();
      await checkIfUserRegistered();
      setNewProfileName("");
      setLoading(false);
    } catch (error) {
      console.error("Error registering for competition:", error);
      setLoading(false);
    }
  };

  // Update profile name
  const updateProfileName = async () => {
    try {
      setLoading(true);
      const tx = await competitionContract.updateProfileName(newProfileName);
      await tx.wait();
      setUserName(newProfileName);
      setNewProfileName("");
      await fetchRanking();
      setLoading(false);
    } catch (error) {
      console.error("Error updating profile name:", error);
      setLoading(false);
    }
  };

  // Register steps
  const registerSteps = async () => {
    try {
      if (steps <= 0) {
        alert("Please enter a valid number of steps");
        return;
      }
      
      setLoading(true);
      const tx = await competitionContract.registerSteps(steps);
      await tx.wait();
      setSteps(0);
      await fetchRanking();
      setLoading(false);
    } catch (error) {
      console.error("Error registering steps:", error);
      setLoading(false);
    }
  };

  // Fetch ranking
  const fetchRanking = async (contract = competitionContract) => {
    try {
      if (contract && signer) { // Check that signer exists
        const [addresses, steps, names] = await contract.getRanking();
        
        // Create an array of objects with address, steps, and names
        const rankingData = addresses.map((address, index) => ({
          address: address,
          steps: steps[index].toString(),
          name: names[index],
          position: index + 1
        }));
        
        setRanking(rankingData);
      }
    } catch (error) {
      console.error("Error fetching ranking:", error);
      setRanking([]);
    }
  };

  // Listen for CompetitionCreated events from Factory
  useEffect(() => {
    if (factoryContract && provider) {  // Make sure provider exists
      try {
        const onCompetitionCreated = (competitionAddress) => {
          console.log(`New competition created at ${competitionAddress}`);
          getCompetitions(factoryContract);
        };

        // Set up event listener
        factoryContract.on("CompetitionCreated", onCompetitionCreated);
        
        // Clean up function
        return () => {
          factoryContract.off("CompetitionCreated", onCompetitionCreated);
        };
      } catch (error) {
        console.error("Error setting up factory event listeners:", error);
      }
    }
  }, [factoryContract, provider]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🚶‍♂️ Step Competition DApp</h1>
        <p className="tagline">Incentivando um estilo de vida mais saudável e sustentável</p>
      </header>
      
      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <div className="main-content">
          <div className="user-info">
            <p><strong>Seu endereço:</strong> {userAddress ? `${userAddress.substring(0, 6)}...${userAddress.substring(38)}` : "Não conectado"}</p>
            {isRegistered && <p><strong>Seu nome:</strong> {userName || "Anonymous Stepper"}</p>}
          </div>
          
          <div className="competitions-section">
            <h2>Competições</h2>
            <div className="competition-controls">
              <input 
                type="text"
                value={newCompetitionName}
                onChange={(e) => setNewCompetitionName(e.target.value)}
                placeholder="Nome da Competição"
                className="competition-name-input"
              />
              <button onClick={createCompetition} className="create-btn" disabled={loading}>
                {loading ? "Criando..." : "Criar Nova Competição"}
              </button>
            </div>
            
            <div className="competition-list">
              <h3>Competições Disponíveis</h3>
              {competitions.length === 0 ? (
                <p>Nenhuma competição encontrada. Crie uma nova!</p>
              ) : (
                <div className="competition-items">
                  {competitions.map((competition, index) => (
                    <div 
                      key={index} 
                      className={`competition-item ${selectedCompetition === competition.address ? 'selected' : ''}`}
                      onClick={() => selectCompetition(competition.address)}
                    >
                      <span>{competition.name || `Competição #${index + 1}`}</span>
                      <span className="competition-address">{competition.address.substring(0, 6)}...{competition.address.substring(38)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {selectedCompetition ? (
            <div className="competition-details">
              <h2>{selectedCompetitionName || "Detalhes da Competição"}</h2>
              <p><strong>Endereço do Contrato:</strong> {selectedCompetition}</p>
              
              {!isRegistered ? (
                <div className="registration-section">
                  <p>Você ainda não está registrado nesta competição</p>
                  <div className="name-input-container">
                    <input 
                      type="text" 
                      value={newProfileName}
                      onChange={(e) => setNewProfileName(e.target.value)}
                      placeholder="Seu nome (opcional)"
                      disabled={loading}
                      className="name-input"
                    />
                  </div>
                  <button onClick={register} className="register-btn" disabled={loading}>
                    {loading ? "Registrando..." : "Registrar-se"}
                  </button>
                </div>
              ) : (
                <div className="steps-section">
                  <h3>Registrar Passos</h3>
                  <div className="steps-input">
                  <input 
                        type="number" 
                        min="1"
                        onChange={(e) => {
                          const inputValue = e.target.value.replace(/^0+/, '') || '0';
                          setSteps(parseInt(inputValue) || 0);
                        }}
                        value={steps === 0 ? '' : steps}
                        placeholder="Número de passos"
                        disabled={loading}
                      />
                    <button onClick={registerSteps} disabled={loading || steps <= 0}>
                      {loading ? "Registrando..." : "Registrar"}
                    </button>
                  </div>
                  
                  <div className="profile-update-section">
                    <h4>Atualizar Perfil</h4>
                    <div className="name-input-container">
                      <input 
                        type="text" 
                        value={newProfileName}
                        onChange={(e) => setNewProfileName(e.target.value)}
                        placeholder="Novo nome"
                        disabled={loading}
                        className="name-input"
                      />
                      <button onClick={updateProfileName} disabled={loading || !newProfileName}>
                        {loading ? "Atualizando..." : "Atualizar Nome"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="ranking-section">
                <h3>Ranking</h3>
                {ranking.length === 0 ? (
                  <p>Nenhum participante registrado ainda.</p>
                ) : (
                  <table className="ranking-table">
                    <thead>
                      <tr>
                        <th>Posição</th>
                        <th>Nome</th>
                        <th>Endereço</th>
                        <th>Passos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ranking.map((item, index) => (
                        <tr key={index} className={item.address === userAddress ? 'current-user' : ''}>
                          <td>{item.position}</td>
                          <td>{item.name || "Anonymous Stepper"}</td>
                          <td>
                            {item.address === userAddress ? 
                              'Você' : 
                              `${item.address.substring(0, 6)}...${item.address.substring(38)}`
                            }
                          </td>
                          <td>{item.steps}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          ) : competitions.length > 0 ? (
            <div className="competition-details">
              <p>Selecione uma competição para ver os detalhes</p>
            </div>
          ) : (
            <div className="competition-details">
              <p>Nenhuma competição disponível. Crie uma nova para começar!</p>
            </div>
          )}
        </div>
      )}
      
      <footer className="app-footer">
        <p>Desenvolvido para incentivar um estilo de vida mais ativo e sustentável.</p>
      </footer>
    </div>
  );
}

export default App;