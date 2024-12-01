import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonLabel,
  IonItem,
  IonToast,
  IonImg,
} from '@ionic/react';

import './login.css';
import { login } from '../../services/apiService'; // Import du service d'API

const Login: React.FC = () => {
  const [matricule, setMatricule] = useState('M1234');
  const [password, setPassword] = useState('password123');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(''); // Message de l'erreur

  const handleLogin = async () => {
    try {
      const data = await login(matricule, password);
      if (data.token) {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('campagne', JSON.stringify(data.campagne));
        sessionStorage.setItem('agent', JSON.stringify(data.agent));
        window.location.href = '/navire'; 
      } else if(data.error) {
        setToastMessage(data.error);
        setShowToast(true);
      }else {
        setToastMessage(data.errors.mot_passe+ " "+ data.errors.matricule);
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage('Erreur lors de la connexion. Veuillez réessayer.');
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding" style={{ backgroundColor: '#ffffff' }}>
        {/* Logo en haut */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <IonImg
            src="/assets/SMMC-Logo.png"
            alt="Logo Top"
            style={{
              maxWidth: '80%',
              borderRadius: '10px',
              marginTop: '30%',
              marginLeft: '8%',
            }}
          />
        </div>

        {/* Formulaire de connexion */}
        <div style={{ textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
          <h2>Connexion</h2>
          <IonItem>
            <IonLabel position="stacked">Matricule</IonLabel>
            <IonInput
              value={matricule}
              placeholder="Entrez votre matricule"
              onIonChange={(e) => setMatricule(e.detail.value!)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Mot de passe</IonLabel>
            <IonInput
              type="password"
              value={password}
              placeholder="Entrez votre mot de passe"
              onIonChange={(e) => setPassword(e.detail.value!)}
            />
          </IonItem>
          <IonButton expand="block" onClick={handleLogin} style={{ marginTop: '20px' }}>
            Se connecter
          </IonButton>
        </div>
        {/* Toast pour les erreurs */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          cssClass="toast-text-white"
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
