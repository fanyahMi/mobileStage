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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonModal,
  IonItem,
  IonInput,
  IonLabel,
  IonToast,
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { arrowBack, grid, person, timeOutline, calendar, layers } from 'ionicons/icons';
import { fetchHistoriqueEmbarquementsCale, updateNombrePalettes } from '../../services/apiService';
import './Historique.css';
import './ModifierPalettes.css';
const HistoriqueCal: React.FC = () => {
  const history = useHistory();
  const { id, navire, numero } = useParams<{ id: string, navire: string, numero: string }>();
  const [historiques, setHistoriques] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedHistorique, setSelectedHistorique] = useState<any | null>(null);
  const [nombrePalettes, setNombrePalettes] = useState<number | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedHistoriques = historiques.slice(startIndex, endIndex);
  const totalPages = Math.ceil(historiques.length / itemsPerPage);

  useEffect(() => {
    const fetchHistorique = async () => {
      try {
        const IdNavire = Number(id);
        const cale = Number(numero);
        const response = await fetchHistoriqueEmbarquementsCale(IdNavire, cale);
        console.log(response);
        setHistoriques(response);
      } catch (error) {
        console.error("Erreur lors de la récupération des historiques :", error);
      }
    };
    fetchHistorique();
  }, [id, numero]);

  const handleBackClick = () => {
    window.location.href = `/embarquement/${id}/${navire}`; 
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const openModal = (historique: any) => {
    setSelectedHistorique(historique);
    setNombrePalettes(historique.nombre_pallets);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedHistorique(null);
    setNombrePalettes(undefined);
  };

  const handleUpdate = async () => {
    if (!selectedHistorique || nombrePalettes === undefined) return;

    try {
      const response = await updateNombrePalettes(selectedHistorique.id_embarquement, nombrePalettes);

      if (response.status === 'success') {
        setToastMessage('Le nombre de palettes a été modifié avec succès.');
        setHistoriques((prev) =>
          prev.map((h) =>
            h.id_embarquement === selectedHistorique.id_embarquement
              ? { ...h, nombre_pallets: nombrePalettes }
              : h
          )
        );
      } else {
        setToastMessage('Une erreur est survenue lors de la modification.');
      }
      setShowToast(true);
      closeModal();
    } catch (error) {
      console.error('Erreur lors de la mise à jour des palettes :', error);
      setToastMessage("Une erreur s'est produite.");
      setShowToast(true);
    }
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
        {paginatedHistoriques.map((historique) => (
          <IonCard key={historique.id_embarquement} className="navire-card">
            <IonCardHeader>
              <IonCardTitle>Cale {historique.numero_cal}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
            <IonText>
                <p style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                  <IonIcon icon={person} style={{ marginRight: '8px' }} />
                  Agent : {historique.agent}
                </p>
                <p style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                  <IonIcon icon={grid} style={{ marginRight: '8px' }} />
                  Station : {historique.numero_station} {historique.station}
                </p>
                <p style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                  <IonIcon icon={calendar} style={{ marginRight: '8px' }} />
                  Date et Heure : {historique.date_embarquement} / {historique.heure_embarquement}
                </p>
                <p style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                  <IonIcon icon={timeOutline} style={{ marginRight: '8px' }} />
                  Shift : {historique.id_shift}
                </p>
                <p style={{ fontSize: '18px' }}>
                  <IonIcon icon={layers} style={{ marginRight: '8px' }} />
                  Quantité palettes : {historique.nombre_pallets}
                </p>
                <IonButton expand="block" onClick={() => openModal(historique)}>
                  Modifier
                </IonButton>
              </IonText>

            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
            <IonButton onClick={goToPreviousPage} disabled={currentPage === 1} color="primary" size="small">
              Précédent
            </IonButton>
            <IonText style={{ margin: '2% 5%' }}>
              Page {currentPage} sur {totalPages}
            </IonText>
            <IonButton onClick={goToNextPage} disabled={currentPage === totalPages} color="primary" size="small">
              Suivant
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>

      {/* Modal de modification */}
      <IonModal isOpen={showModal} onDidDismiss={closeModal}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Modifier Palettes</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="modifier-palettes-container">
            <IonItem className="form-item">
              <IonLabel position="stacked">Nombre de palettes</IonLabel>
              <IonInput
                type="number"
                value={nombrePalettes}
                placeholder="Entrez le nombre de palettes"
                onIonChange={(e) =>
                  setNombrePalettes(Number(e.detail.value) || undefined)
                }
              />
            </IonItem>
            <IonButton expand="block" onClick={handleUpdate} className="update-button">
              Modifier
            </IonButton>
            <IonButton expand="block" color="light" onClick={closeModal} className="update-button">
              Annuler
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

      {/* Toast de notification */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
        position="top"
      />
    </IonPage>
  );
};

export default HistoriqueCal;
