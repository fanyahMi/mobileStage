import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonText,
  IonFooter,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonLabel,
  IonItem,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import './Historique.css';
import { arrowBack, grid, person, time, search } from 'ionicons/icons';
import { fetchHistoriqueEmbarquementsCale, fetchStationsEncours } from '../../services/apiService';



const HistoriqueCal: React.FC = () => {
  const history = useHistory();
  const { id, navire, numero } = useParams<{ id: string, navire: string, numero: string }>();
  const [historiques, setHistoriques] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  


  const [showSearch, setShowSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [agent, setAgent] = useState('');
  const [station, setStation] = useState('');
  const [shift, setShift] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [heureDebut, setHeureDebut] = useState('');
  const [heureFin, setHeureFin] = useState('');
  const [filteredHistoriques, setFilteredHistoriques] = useState<any[]>([]); // Nouvel état pour les historiques filtrés
  
  const itemsPerPage = 5; // Nombre d'éléments par page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedHistoriques = filteredHistoriques.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredHistoriques.length / itemsPerPage);


  useEffect(() => {
    const fetchHistorique = async () => {
      try {
        const IdNavire = Number(id);
        const cale = Number(numero);
        const response = await fetchHistoriqueEmbarquementsCale(IdNavire, cale);
        setHistoriques(response);
        setFilteredHistoriques(response); // Par défaut, on affiche tous les historiques
      } catch (error) {
        console.error("Erreur lors de la récupération des historiques :", error);
      }
    };

    const getStations = async () => {
      try {
        const data = await fetchStationsEncours();
        setStations(data);
      } catch (error) {
        console.error('Erreur lors du chargement des stations:', error);
      }
    };

    getStations();
    fetchHistorique();
  }, [id, navire]);

  const handleBackClick = () => {
    history.push('/');
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  

  

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton fill="clear" slot="start" onClick={handleBackClick}>
            <IonIcon icon={arrowBack} />
          </IonButton>
          <IonTitle>Historique - Navire {navire} - Cale {numero}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>

        {paginatedHistoriques.map((historique, index) => (
          <IonCard key={historique.id_embarquement} className="navire-card">
            <IonCardHeader>
              <IonCardTitle>Cale {historique.numero_cal}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <p style={{ fontSize: '18px' }}>
                  <IonIcon icon={person} style={{ marginRight: '8px' }} />
                  Agent : {historique.agent}
                </p>
                <p style={{ fontSize: '18px' }}>
                  <IonIcon icon={grid} style={{ marginRight: '8px' }} />
                  Station : {historique.numero_station}  {historique.station}
                </p>
                <p style={{ fontSize: '18px' }}>
                  <IonIcon icon={time} style={{ marginRight: '8px' }} />
                  Date et Heure : {historique.date_embarquement}   {historique.heure_embarquement}
                </p>
                <p style={{ fontSize: '18px' }}>
                  Quantité palettes : {historique.nombre_pallets}
                </p>
                <p style={{ fontSize: '18px' }}>
                  Quantité Tonne: {historique.quantite}
                </p>
              </IonText>
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
            <IonButton
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              color="primary"
              size="small"
            >
              Précédent
            </IonButton>
            <IonText style={{ margin: '2% 5%' }}>
              Page {currentPage} sur {totalPages}
            </IonText>
            <IonButton
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              color="primary"
              size="small"
            >
              Suivant
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default HistoriqueCal;
