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
import { Virtuoso } from 'react-virtuoso';

const Tafsir = ({ match }) => {
  let id = match.params.id;
  const [data, setData] = useState();

  // get from store (global state)
  const isUpdated = Store.useState(selectors.getIsUpdatedGl);
  const isImported = Store.useState(selectors.getIsImportedGl);

  useEffect(() => {
    let load = async () => {
      if (isImported) {
        let db = await sqlite.createConnection('db-from-json', false, 'no-encryption', 1);
        await db.open();
        // let res = await db.query(`SELECT title, tafsir FROM tafsirs WHERE id = ${id};`);
        let res = await db.query(
          `select tafsir_parts.id, title, tafsir from tafsirs inner join tafsir_parts on tafsirs.id = tafsir_parts.tafsirid WHERE tafsirs.id = ${id};`
        );
        setData(res.values);
        await db.close();
        await sqlite.closeConnection('db-from-json');
      }
    };
    load();
    console.log('Tafsir useEffect');
  }, [isUpdated, isImported]);

  console.log(data);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tafsir</IonTitle>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <h1>Tafsir</h1>
        {data && (
          <>
            <Virtuoso
              // style={{ height: '100vh' }}
              totalCount={data.length}
              itemContent={index => (
                <div id={`tafsir-part-${index}`}>
                  <h2 style={{ textAlign: 'center' }}>{data[index].title}</h2>
                  <p>{data[index].tafsir}</p>
                </div>
              )}
            />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tafsir;
