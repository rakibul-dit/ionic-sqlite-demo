import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonBackButton,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { sqlite } from '../AppShell';
import Store from '../../store';
import * as selectors from '../../store/selectors';

const Users = () => {
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
      }
    };
    load();
    console.log('Users useEffect');
  }, [isUpdated, isImported]);

  console.log(data);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Users</IonTitle>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <h1 style={{ textAlign: 'center' }}>Users</h1>
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

export default Users;
