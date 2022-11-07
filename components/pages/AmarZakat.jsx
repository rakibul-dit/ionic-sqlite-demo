import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonBackButton,
} from '@ionic/react';
import Store from '../../store';
import * as selectors from '../../store/selectors';

const AmarZakat = () => {
  // get from store (global state)
  const isUpdated = Store.useState(selectors.getIsUpdatedGl);
  const isImported = Store.useState(selectors.getIsImportedGl);
  const tafsir200 = Store.useState(selectors.getTafsir200);

  console.log(tafsir200);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>AmarZakat</IonTitle>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        {tafsir200 && (
          <>
            <h1 style={{ textAlign: 'center' }}>{tafsir200.title}</h1>
            <p>{tafsir200.tafsir}</p>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AmarZakat;
