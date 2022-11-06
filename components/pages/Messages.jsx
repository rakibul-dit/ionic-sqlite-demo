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

const Messages = () => {
  const [data, setData] = useState();

  // get from store (global state)
  const isUpdated = Store.useState(selectors.getIsUpdatedGl);
  const isImported = Store.useState(selectors.getIsImportedGl);

  useEffect(() => {
    let load = async () => {
      if (isImported) {
        let db = await sqlite.createConnection('db-from-json', false, 'no-encryption', 1);
        await db.open();
        let res = await db.query('SELECT * FROM messages;');
        setData(res.values);
        await db.close();
        await sqlite.closeConnection('db-from-json');
      }
    };
    load();
    console.log('Messages useEffect');
  }, [isUpdated, isImported]);

  console.log(data);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Messages</IonTitle>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <h1 style={{ textAlign: 'center' }}>Messages</h1>
        {data && (
          <table>
            <tbody>
              <tr>
                <th>User Id</th>
                <th>Title</th>
                <th>Body</th>
              </tr>
              {data.map((item, i) => (
                <tr key={i}>
                  <td>{item.userid}</td>
                  <td>{item.title}</td>
                  <td>{item.body}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Messages;
