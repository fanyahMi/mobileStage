import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle, 
  IonCardContent, 
  IonButton, 
  IonIcon 
} from '@ionic/react';
import { Link } from 'react-router-dom';
import { boat, calendar, layers, logIn, folder, cube } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { fetchNavires } from '../../services/apiService';
import './Navire.css';

const Navire: React.FC = () => {
  const [navires, setNavires] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadNavires = async () => {
      try {
        const data = await fetchNavires();
        setNavires(data);
      } catch (err) {
        setError('Erreur lors du chargement des navires');
      } finally {
        setLoading(false);
      }
    };

    loadNavires();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Liste des Navires</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="navire-content">
        {loading ? (
          <p>Chargement...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          navires.map((navire) => (
            <IonCard key={navire.id_navire} className="navire-card">
              <IonCardHeader>
                <IonCardTitle>
                  <IonIcon icon={boat} style={{ marginRight: "8px", color: "var(--ion-color-primary)" }} />
                  {navire.navire}
                </IonCardTitle>
                <IonCardSubtitle>
                  <IonIcon icon={layers} style={{ marginRight: "8px", color: "var(--ion-color-secondary)" }} />
                  <strong>{navire.nb_compartiment}</strong> Compartiments
                </IonCardSubtitle>
                <IonCardSubtitle>
                  <IonIcon icon={calendar} style={{ marginRight: "8px", color: "var(--ion-color-tertiary)" }} />
                  Arrivée prévue : <strong>{new Date(navire.date_arriver).toLocaleDateString()}</strong>
                </IonCardSubtitle>
                <IonCardSubtitle>
                  <IonIcon icon={cube} style={{ marginRight: "8px", color: "var(--ion-color-primary)" }} />
                  Quantité Max :  <strong>{Number(navire.quantite_max || 0).toLocaleString('fr-FR')} tonnes</strong>
                </IonCardSubtitle>

                  <IonCardSubtitle>
                    <IonIcon icon={cube} style={{ marginRight: "8px", color: "var(--ion-color-primary)" }} />
                    Quantité Embarqué :  <strong>{Number(navire.quantite_embarque).toLocaleString('fr-FR')} tonnes</strong>
                  </IonCardSubtitle>


              </IonCardHeader>
              <IonCardContent>
                <Link to={`/embarquement/${navire.id_navire}/${navire.navire}`}>
                  <IonButton 
                    color="primary" 
                    expand="block" 
                    style={{ marginBottom: "10px" }}
                  >
                    <IonIcon icon={logIn} slot="start" />
                    Embarquement
                  </IonButton>
                </Link>
                
              </IonCardContent>
              
            </IonCard>
          ))
        )}
      </IonContent>
    </IonPage>
  );
};

export default Navire;
