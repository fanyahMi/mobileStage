import { IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { boat, logOut } from 'ionicons/icons'; // Nouveaux icônes
import { Route, Redirect } from 'react-router-dom';
import Navire from './pages/navire/Navire';
import NavireDetails from './pages/navire/NavireDetails';
import Login from './pages/login/Login';
import Embarquement from './pages/embarquement/Embarquement';
import Embarquer from './pages/embarquement/Embarquer';
import Historique from './pages/historique/Historique';
import HistoriqueCal from './pages/historique/HistoriqueCal';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css'; // Assurez-vous que ce fichier est bien configuré

setupIonicReact();

const App: React.FC = () => {
  const token = sessionStorage.getItem('token');

  const handleLogout = () => {
    sessionStorage.removeItem('token'); 
    window.location.href = '/mobile-login'; 
  };

  if (!token) {
    return (
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/mobile-login" component={Login} />
            <Route>
              <Redirect to="/mobile-login" />
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    );
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/navire" component={Navire} />
            <Route exact path="/navire/:id" component={NavireDetails} />
            <Route exact path="/embarquement/:id/:navire" component={Embarquement} />
            <Route path="/historique/:id/:navire/:cales" exact component={Historique} />
            <Route path="/historiquecal/:id/:navire/:numero" exact component={HistoriqueCal} />
            <Route path="/embarquer/:id/:navire/:numero" exact component={Embarquer} />
            <Route exact path="/">
              <Redirect to="/navire" />
            </Route>
          </IonRouterOutlet>

          <IonTabBar slot="bottom" className="custom-tab-bar">
            <IonTabButton tab="tab1" href="/navire">
              <IonIcon aria-hidden="true" icon={boat} />
              <IonLabel>Navire</IonLabel>
            </IonTabButton>
            <IonTabButton tab='deconnexion' onClick={handleLogout}>
              <IonIcon aria-hidden="true" icon={logOut} />
              <IonLabel>Déconnexion</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
