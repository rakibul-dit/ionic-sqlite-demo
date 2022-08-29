import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';
import Menu from './Menu';
import Home from './pages/Home';
import { useSQLite } from 'react-sqlite-hook';
import { useEffect, useState } from 'react';
import { Storage } from '@ionic/storage';
import { fullImportFromJson, updateDb } from './db-utils/jsonImport';
import { setIsImportedGl } from '../store/actions';

// Singleton SQLite Hook
export let sqlite;

const AppShell = () => {
  setupIonicReact({
    // mode: 'md',
  });

  const store = new Storage();
  store.create();

  const {
    echo,
    getPlatform,
    createConnection,
    closeConnection,
    retrieveConnection,
    retrieveAllConnections,
    closeAllConnections,
    addUpgradeStatement,
    importFromJson,
    isJsonValid,
    copyFromAssets,
    isAvailable,
  } = useSQLite();
  sqlite = {
    echo: echo,
    getPlatform: getPlatform,
    createConnection: createConnection,
    closeConnection: closeConnection,
    retrieveConnection: retrieveConnection,
    retrieveAllConnections: retrieveAllConnections,
    closeAllConnections: closeAllConnections,
    addUpgradeStatement: addUpgradeStatement,
    importFromJson: importFromJson,
    isJsonValid: isJsonValid,
    copyFromAssets: copyFromAssets,
    isAvailable: isAvailable,
  };

  const [isImported, setIsImported] = useState();
  console.log(isImported);

  const getIsImported = async v => {
    v = await store.get('isImported');
    if (v) {
      setIsImported(true);
      setIsImportedGl(true);
    } else {
      setIsImported(false);
      setIsImportedGl(false);
    }
  };

  const storeIsImported = async _ => {
    await store.set('isImported', true);
  };

  useEffect(() => {
    getIsImported();
    const loadDb = async () => {
      // db is not imported
      if (isImported === false) {
        // json import from local
        let res = await fullImportFromJson();
        if (res) {
          // db imported successfully
          setIsImportedGl(true);
          storeIsImported();
        }
      }
      // db is imported & user is in online
      if (isImported === true && navigator.onLine) {
        // request for update data
        await updateDb();
      }
    };
    loadDb();
  }, [isImported]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/" render={() => <Home />} />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default AppShell;
