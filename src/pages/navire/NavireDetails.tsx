import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { useParams } from 'react-router-dom';

const navires = [
  { id: 1, nom: "Navire Alpha", nombreCompartiments: 12, dateArrivee: "2024-11-25" },
  { id: 2, nom: "Navire Beta", nombreCompartiments: 8, dateArrivee: "2024-11-27" },
  { id: 3, nom: "Navire Gamma", nombreCompartiments: 16, dateArrivee: "2024-11-30" },
];

const NavireDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navire = navires.find((n) => n.id === parseInt(id));

  if (!navire) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Navire Introuvable</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <p>Ce navire n'existe pas.</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Détails du {navire.nom}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div style={{ padding: "16px" }}>
          <h2>Nom : {navire.nom}</h2>
          <p><strong>Nombre de Compartiments :</strong> {navire.nombreCompartiments}</p>
          <p><strong>Date d'Arrivée :</strong> {navire.dateArrivee}</p>
          <IonButton expand="block" color="primary" onClick={() => (window.location.href = "/navire")}>
            Retour à la liste
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default NavireDetails;
