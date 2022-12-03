import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonMenuButton,
  IonButton,
  IonItem,
  IonInput,
  useIonRouter,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import Store from '../../store';
import * as selectors from '../../store/selectors';
import { setIsTriggerUpdate } from '../../store/actions';

const Home = () => {
  const [index, setIndex] = useState(0);
  const [behavior, setBehavior] = useState('auto');
  // get from store (global state)
  const isImported = Store.useState(selectors.getIsImportedGl);
  const router = useIonRouter();

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
        <IonButton routerLink="/amar-zakat">Amar Zakat</IonButton>
        <IonItem>
          <IonInput
            type="number"
            min={0}
            step="1"
            value={index}
            autofocus
            inputMode="numeric"
            onIonChange={e => setIndex(e.detail.value)}
          ></IonInput>
          <label>
            <b>Behavior:</b>
            <select value={behavior} onChange={e => setBehavior(e.target.value)}>
              <option value="auto">Instant (auto)</option>
              <option value="smooth">Smooth</option>
            </select>
          </label>
          <IonButton
            onClick={() => {
              router.push(`/tafsirs/2/${index}-${behavior}`, 'forward', 'push');
            }}
          >
            Scroll To
          </IonButton>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default Home;
