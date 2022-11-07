import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonMenuButton,
  IonButton,
} from '@ionic/react';
import { useEffect } from 'react';
import Store from '../../store';
import * as selectors from '../../store/selectors';
import { setIsTriggerUpdate } from '../../store/actions';

const Home = () => {
  // get from store (global state)
  const isImported = Store.useState(selectors.getIsImportedGl);

  useEffect(() => {
    isImported && setIsTriggerUpdate(true);
  }, [isImported]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <h1 style={{ textAlign: 'center' }}>Home</h1>
        <IonButton routerLink="/users">Users</IonButton>
        <IonButton routerLink="/messages">Messages</IonButton>
        <IonButton routerLink="/tafsirs">Tafsirs</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;
