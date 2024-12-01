// src/services/apiService.ts
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export const login = async (matricule: string, motPasse: string) => {
  try {
    const response = await axios.post(`${API_URL}/v1/login`, {
      matricule:matricule,
      mot_passe: motPasse,
    });
    return response.data; 
   } catch (error) {
        
  }
};

export const fetchNavires = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Token manquant');
    }
  
    try {
      const response = await axios.get(`${API_URL}/v1/navires/en-place`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      return response.data; 
    } catch (error) {
      console.error("Erreur lors de la récupération des navires : ", error);
      throw error; 
    }
  };
export const fetchShiftEnCours = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Token manquant');
    }
  
    try {
      const response = await axios.get(`${API_URL}/v1/shifts/en-cours`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      return response.data; 
    } catch (error) {
      console.error("Erreur lors de la récupération du shift : ", error);
      throw error; 
    }
  };


export const fetchCalesNavires = async (idNavire:number) => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Token manquant');
    }
  
    try {
      const response = await axios.get(`${API_URL}/v1/navires/cales/${idNavire}`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      return response.data; 
    } catch (error) {
      console.error("Erreur lors de la récupération des navires : ", error);
      throw error; 
    }
  };

  export const embarquer = async (data: any) => { 
    const token = sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Token manquant');
    }
  
    try {
      const response = await axios.post(`${API_URL}/v1/embarquements`,data, {
        params: data,  // Ajoutez 'data' comme paramètres de requête
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des navires : ", error);
      throw error;
    }
  };
  


  export const fetchStationsEncours = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Token manquant');
    }
  
    try {
      const response = await axios.get(`${API_URL}/v1/campagnes/stations/numero-stations`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      return response.data; 
    } catch (error) {
      console.error("Erreur lors de la récupération des navires : ", error);
      throw error; 
    }
  };

  export const fetchHistoriqueEmbarquementsNavire = async (idNavire: number) => {
    const token = sessionStorage.getItem('token');
    const campagne = sessionStorage.getItem('campagne');
    
    if (!token) {
      throw new Error('Token manquant');
    }
  
    if (!campagne) {
      throw new Error('Campagne manquante');
    }
  
    const parsedCampagne = JSON.parse(campagne);
  
    try {
      const data = { 
        id_navire: idNavire,
        id_campagne: parsedCampagne?.id_compagne,
      };
  
      const response = await axios.post(
        `${API_URL}/v1/embarquements/historiques/navires/embarquements`,
        data, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des historiques :", error);
      throw error;
    }
  };



  export const fetchHistoriqueEmbarquementsCale= async (idNavire: number, numeroCale : number) => {
    const token = sessionStorage.getItem('token');
    const campagne = sessionStorage.getItem('campagne');
    
    if (!token) {
      throw new Error('Token manquant');
    }
  
    if (!campagne) {
      throw new Error('Campagne manquante');
    }
  
    const parsedCampagne = JSON.parse(campagne);
  
    try {
      const data = { 
        id_navire: idNavire,
        id_campagne: parsedCampagne?.id_compagne,
        cale:  numeroCale
      };
  
      const response = await axios.post(
        `${API_URL}/v1/embarquements/historiques/cale`,
        data, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des historiques :", error);
      throw error;
    }
  };
