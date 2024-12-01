import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonText } from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { logIn, folder, arrowBack, time, grid } from 'ionicons/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { fetchCalesNavires } from '../../services/apiService'; 
import './Embarquement.css';

// Composant principal
const Embarquement: React.FC = () => {
  const { id, navire } = useParams<{ id: string, navire: string }>();
  const history = useHistory(); // Pour la navigation
  const [compartiments, setCompartiments] = useState<any[]>([]); // État pour stocker les données des cales
  const [loading, setLoading] = useState<boolean>(true); // Pour gérer l'état de chargement
  const [error, setError] = useState<string | null>(null); // Pour gérer les erreurs

  // Fonction pour charger les cales
  const loadCales = async () => {
    try {
      const data = await fetchCalesNavires(parseInt(id)); // Appel à l'API pour récupérer les cales du navire
      setCompartiments(data); // Mettre à jour l'état avec les données récupérées
    } catch (err) {
      setError('Erreur lors du chargement des cales.');
    } finally {
      setLoading(false);
    }
  };

  // Charger les cales lorsque le composant est monté
  useEffect(() => {
    loadCales();
  }, [id]); // Le `id` change si on navigue vers un autre navire

  const handleBackClick = () => {
    history.push("/navire"); // Redirige vers la page des navires
  };

  if (loading) {
    return <IonContent>Chargement...</IonContent>; // Affichage pendant le chargement
  }

  if (error) {
    return <IonContent>{error}</IonContent>; // Affichage des erreurs
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton fill="clear" slot="start" onClick={handleBackClick}>
            <IonIcon icon={arrowBack} />
          </IonButton>
          <IonTitle>Embarquement - Navire {navire}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Liste des compartiments */}
        {compartiments.map((compartiment) => (
          <IonCard key={compartiment.numero_cale} className="navire-card">
            <IonCardHeader>
              <IonCardTitle>Cale {compartiment.numero_cale}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <p style={{ fontSize: '18px' }}>
                  <IonIcon icon={grid} style={{ marginRight: '8px' }} /> Quantité pallets : {compartiment.total_pallets}
                </p>
                <p style={{ fontSize: '18px' }}>
                  <IonIcon icon={grid} style={{ marginRight: '8px' }} /> Quantité tonnes : {compartiment.total_quantite} {/* Utiliser des données appropriées pour la quantité restante */}
                </p>
              </IonText>

              {/* Boutons centrés */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <Link to={`/historiquecal/${id}/${navire}/${compartiment.numero_cale}`}>
                  <IonButton color="secondary" style={{ width: '150px' }}>
                    <IonIcon icon={folder} slot="start" />
                    Historique
                  </IonButton>
                </Link>
                <Link to={`/embarquer/${id}/${navire}/${compartiment.numero_cale}`}>
                  <IonButton color="success" style={{ width: '150px' }}>
                    <IonIcon icon={logIn} slot="start" />
                    Embarquer
                  </IonButton>
                </Link>
              </div>
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Embarquement;
