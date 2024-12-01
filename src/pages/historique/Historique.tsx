import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonText,
  IonFooter,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonItem,
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import './Historique.css';
import { arrowBack, grid, business, search } from 'ionicons/icons';
import { fetchHistoriqueEmbarquementsNavire, fetchStationsEncours } from '../../services/apiService';

const Historique: React.FC = () => {
  const history = useHistory();
  const { id, navire, cales } = useParams<{ id: string, navire: string, numero: string, cales: string }>();
  const [historiques, setHistoriques] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [selectedStation, setSelectedStation] = useState<string>('');
  const [filteredHistoriques, setFilteredHistoriques] = useState<any[]>([]); // Nouvel état pour les historiques filtrés
  const [selectedCompartiment, setSelectedCompartiment] = useState<string>('');

  useEffect(() => {
    const fetchHistorique = async () => {
      try {
        const IdNavire = Number(id);
        const response = await fetchHistoriqueEmbarquementsNavire(IdNavire);
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

  const handleStationChange = (stationId: string) => {
    setSelectedStation(stationId);
    filterHistorique(stationId, selectedCompartiment); // Filtrer avec la station et compartiment
  };

  const handleCompartimentChange = (compartiment: string) => {
    setSelectedCompartiment(compartiment);
    filterHistorique(selectedStation, compartiment); // Filtrer avec le compartiment et station
  };

  const filterHistorique = (stationId: string, compartiment: string) => {
    console.log(compartiment);
    const cale = Number(compartiment);
    // Filtrer les historiques selon stationId et compartiment
    const filtered = historiques.filter((historique) => {
      const matchesStation = stationId ? historique.id_station === Number(stationId) : true;
      const matchesCompartiment = compartiment ? historique.numero_cal === cale : true;
      return matchesStation && matchesCompartiment;
    });

    setFilteredHistoriques(filtered);
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // Nombre d'éléments par page

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedHistoriques = filteredHistoriques.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredHistoriques.length / itemsPerPage);

  const handleBackClick = () => {
    history.push('/');
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Affichage du formulaire de recherche
  const [showSearch, setShowSearch] = useState(false);
  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton fill="clear" slot="start" onClick={handleBackClick}>
            <IonIcon icon={arrowBack} />
          </IonButton>
          <IonTitle>Historique - Navire {navire}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonButton onClick={toggleSearch} expand="full" color="primary">
          <IonIcon icon={search} slot="start" />
          Rechercher
        </IonButton>

        {showSearch && (
          <div className="search-form">
              <IonItem>
                <IonLabel>Station</IonLabel>
                <IonSelect
                  placeholder="Sélectionner une station"
                  value={selectedStation}
                  onIonChange={(e) => handleStationChange(e.detail.value)}
                >
                  <IonSelectOption value="">Toutes les stations</IonSelectOption>
                  {stations.map((station) => (
                    <IonSelectOption key={station.id_station} value={station.id_station}>
                      {station.numero_station} - {station.station}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel>Compartiment</IonLabel>
                <IonSelect
                  placeholder="Sélectionner un compartiment"
                  value={selectedCompartiment}
                  onIonChange={(e) => handleCompartimentChange(e.detail.value!)}
                >
                  <IonSelectOption value="">Tous les compartiments</IonSelectOption>
                  {/* Remplacez cette liste par la vôtre */}
                  {Array.from({ length: Number(cales) }, (_, index) => `C${index + 1}`).map((compartiment, index2) => (
                    <IonSelectOption key={compartiment} value={`${index2 + 1}`}>
                      {compartiment}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
          </div>
        )}

        {paginatedHistoriques.map((historique, index) => (
          <IonCard key={`historique-${index}`} className="navire-card">
            <IonCardHeader>
              <IonCardTitle>Cale {historique.numero_cal}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <p style={{ fontSize: '18px' }}>
                  <IonIcon icon={business} style={{ marginRight: '8px' }} />
                  Station : {historique.numero_station} - {historique.station}
                </p>
                <p style={{ fontSize: '18px' }}>
                  <IonIcon icon={grid} style={{ marginRight: '8px' }} />
                  Nombre pallets: {historique.totat_pallets}
                </p>
                <p style={{ fontSize: '18px' }}>
                  <IonIcon icon={grid} style={{ marginRight: '8px' }} />
                  Quantité Tonnes: {historique.total_quantite}
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
            <IonText style={{ margin: '0 15px', lineHeight: '32px' }}>
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

export default Historique;
