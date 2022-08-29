import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonMenuButton,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { Storage } from '@ionic/storage';
import { sqlite } from '../AppShell';
import Store from '../../store';
import * as selectors from '../../store/selectors';

const Home = () => {
  const store = new Storage();
  store.create();

  const [data, setData] = useState();

  // get from store (global state)
  const isUpdated = Store.useState(selectors.getIsUpdatedGl);
  const isImported = Store.useState(selectors.getIsImportedGl);

  const updateServerSyncDate = async () => {
    await store.set('serverSyncDate', new Date());
    // window.location.reload();
  };

  useEffect(() => {
    let load = async () => {
      if (isImported === true && isUpdated === undefined) {
        let db = await sqlite.createConnection('db-from-json', false, 'no-encryption', 1);
        await db.open();
        let res = await db.query('SELECT * FROM users;');
        setData(res.values);
        await db.close();
        await sqlite.closeConnection('db-from-json');
      }
      if (isUpdated === true) {
        let db = await sqlite.createConnection('db-from-json', false, 'no-encryption', 1);
        await db.open();
        let res = await db.query('SELECT * FROM users;');
        setData(res.values);
        await db.close();
        await sqlite.closeConnection('db-from-json');
      }
    };
    load();
  }, [isUpdated, isImported]);

  console.log(data);

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
        <h1 style={{ textAlign: 'center' }}>Header</h1>
        <IonButton onClick={updateServerSyncDate}>Update server syncDate</IonButton>
        <h2>Please click above button and refresh to see update behaviour.</h2>

        {data && (
          <table>
            <tbody>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Age</th>
              </tr>
              {data.map((item, i) => (
                <tr key={i}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p>
          If sever syncDate is greater than local, and internet connection availabe then when app
          launched, it will fetch partial json and update db.
        </p>
        <p>We are mimicing this, using localStorage syncDate by the button.</p>
      </IonContent>
    </IonPage>
  );
};

export default Home;
