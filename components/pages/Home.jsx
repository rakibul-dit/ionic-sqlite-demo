import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonMenuButton,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { Storage } from '@ionic/storage';
import { sqlite } from '../AppShell';
import Store from '../../store';
import * as selectors from '../../store/selectors';
import { setIsFetched } from '../../store/actions';

const Home = () => {
  const store = new Storage();
  store.create();

  const [data, setData] = useState();

  // get from store (global state)
  const isUpdated = Store.useState(selectors.getIsUpdatedGl);
  const isImported = Store.useState(selectors.getIsImportedGl);

  useEffect(() => {
    let load = async () => {
      if (isImported) {
        let db = await sqlite.createConnection('db-from-json', false, 'no-encryption', 1);
        await db.open();
        let res = await db.query('SELECT * FROM users;');
        setData(res.values);
        await db.close();
        await sqlite.closeConnection('db-from-json');
        setIsFetched(true);
      }
    };
    load();
    console.log('home useEffect');
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
      </IonContent>
    </IonPage>
  );
};

export default Home;
