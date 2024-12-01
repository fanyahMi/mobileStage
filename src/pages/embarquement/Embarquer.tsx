import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonFab,
  IonFabButton,
  IonToast,
} from "@ionic/react";
import { useParams, useHistory } from "react-router-dom";
import { addCircleOutline, trashBinOutline, boat, time, person, arrowBack } from "ionicons/icons";
import "./Embarquement.css";
import { fetchShiftEnCours, fetchStationsEncours, embarquer } from '../../services/apiService';

// Liste des stations fictives
const stations = ["Station 1", "Station 2", "Station 3", "Station 4"];

const Embarquer: React.FC = () => {
  const { id, navire, numero } = useParams<{ id: string; navire: string; numero: string }>();
  const history = useHistory();
  const [shift, setShift] = useState<{ description: string; debut: string; fin: string, id_shift:number } | null>(null);
  const [stationPalettes, setStationPalettes] = useState<{ station: string | null; palettes: number }[]>([
    { station: null, palettes: 0 },
  ]);
  const [agent, setAgent] = useState<any>(null); 
  const [stationsList, setStationsList] = useState<any[]>([]);
  const [showToast, setShowToast] = useState(false); // État pour afficher le toast
  const [toastMessage, setToastMessage] = useState(""); // Message à afficher dans le toast

  // Fonction pour récupérer les shifts en cours
  const shiftEnCours = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Token manquant');
    }
    
    try {
      const response = await fetchShiftEnCours();
      setShift(response); 
    } catch (error) {
      console.error("Erreur lors de la récupération du shift : ", error);
    }
  };

  // Fonction pour récupérer les stations
  const getStations = async () => {
    try {
      const data = await fetchStationsEncours();
      setStationsList(data);
    } catch (error) {
      console.error('Erreur lors du chargement des stations:', error);
    }
  };

  // Utilisation de useEffect pour charger les données
  useEffect(() => {
    shiftEnCours();
    const agentData = sessionStorage.getItem('agent');
    if (agentData) {
      setAgent(JSON.parse(agentData)); 
    }
    getStations();
  }, []);

  // Retour à la page précédente
  const handleBackClick = () => {
    history.goBack();
  };

  // Afficher un toast avec un message personnalisé
  const showErrorToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleEmbarquer = async () => {
    // Calculer la somme des palettes
    const totalPalettes = stationPalettes.reduce((total, item) => total + item.palettes, 0);
  
    // Vérifier si la somme des palettes est égale à 4
    if (totalPalettes !== 4) {
      // Si la somme des palettes n'est pas 4, afficher un message d'erreur
      showErrorToast("Le nombre total de palettes doit être égal à 4 pour pouvoir enregistrer l'embarquement.");
      return; // Empêche l'enregistrement
    }

    const data = {
      numero_station_id: stationPalettes.map(item => item.station),  
      navire_id: Number(id), 
      numero_cal: Number(numero),  
      nombre_pallets: stationPalettes.map(item => item.palettes)  
    };

    try {
      const result = await embarquer(data); 
      console.log('Réponse de l\'API :', result);
      window.location.href = `/embarquer/${id}/${navire}/${numero}`;
    } catch (error) {
      console.error('Erreur lors de l\'embarquement :', error);
      // Gérez l'erreur de manière appropriée (par exemple, affichage d'un message d'erreur)
    }
  };

  // Fonction pour gérer le changement de station et palettes
  const handleStationChange = (index: number, field: "station" | "palettes", value: any) => {
    const updatedStations = [...stationPalettes];
    updatedStations[index] = {
      ...updatedStations[index],
      [field]: field === "palettes" ? parseInt(value, 10) || 0 : value,
    };
    setStationPalettes(updatedStations);
  };

  // Ajouter une nouvelle ligne pour station/palettes
  const handleAddLine = () => {
    setStationPalettes([...stationPalettes, { station: null, palettes: 0 }]);
  };

  const handleRemoveLine = (index: number) => {
    setStationPalettes(stationPalettes.filter((_, i) => i !== index));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton fill="clear" slot="start" onClick={handleBackClick}>
            <IonIcon icon={arrowBack} />
          </IonButton>
          <IonTitle>Embarquement - Cale {numero}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonCard className="navire-card">
          <IonCardHeader>
            <IonCardSubtitle>Informations</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonIcon style={{ color: "var(--ion-color-primary)" }} icon={boat} slot="start" />
              <IonLabel>Navire</IonLabel>
              <IonLabel>{navire}</IonLabel>
            </IonItem>
            <IonItem>
              <IonIcon style={{ color: "var(--ion-color-primary)" }} icon={time} slot="start" />
              <IonLabel>Shift</IonLabel>
              <IonLabel>{shift ? `${shift.description} (${shift.debut} - ${shift.fin})` : "Chargement..."}</IonLabel>
            </IonItem>
            <IonItem>
              <IonIcon style={{ color: "var(--ion-color-primary)" }} icon={person} slot="start" />
              <IonLabel>Agent</IonLabel>
              <IonLabel>{agent ? `${agent.matricule}` : "Chargement..."}</IonLabel>
            </IonItem>
          </IonCardContent>
        </IonCard>

        <IonCard className="navire-card">
          <IonCardHeader>
            <IonCardSubtitle>Sélection des Stations et Palettes</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            {stationPalettes.map((stationData, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "16px",
                  border: "1px solid var(--ion-color-medium)",
                  borderRadius: "8px",
                  padding: "16px",
                  position: "relative",
                }}
              >
                <IonButton
                  color="danger"
                  fill="clear"
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                  }}
                  onClick={() => handleRemoveLine(index)}
                >
                  <IonIcon icon={trashBinOutline} />
                </IonButton>
                <IonItem>
                  <IonLabel position="stacked">Station {index + 1}</IonLabel>
                  <IonSelect
                    placeholder="Choisissez une station"
                    value={stationData.station}
                    onIonChange={(e) => handleStationChange(index, "station", e.detail.value)}
                  >
                    {stationsList.map((station) => (
                      <IonSelectOption key={station.id_station} value={station.id_numero_station}>
                        {station.numero_station} - {station.station}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Nombre de Palettes</IonLabel>
                  <IonInput
                    type="number"
                    placeholder="Entrez le nombre de palettes"
                    value={stationData.palettes}
                    onIonChange={(e) => handleStationChange(index, "palettes", e.detail.value)}
                  />
                </IonItem>
              </div>
            ))}
          </IonCardContent>
        </IonCard>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={handleAddLine}>
            <IonIcon icon={addCircleOutline} />
          </IonFabButton>
        </IonFab>

        <IonButton expand="full" color="primary" onClick={handleEmbarquer}>
          Embarquer
        </IonButton>

        {/* IonToast pour afficher le message d'erreur */}
        <IonToast
          isOpen={showToast}
          message={toastMessage}
          duration={3000} // Durée d'affichage du message
          onDidDismiss={() => setShowToast(false)} // Ferme le toast après la durée
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default Embarquer;
