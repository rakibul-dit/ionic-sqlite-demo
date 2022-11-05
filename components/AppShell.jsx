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
import Store from '../store';
import * as selectors from '../store/selectors';
import About from './pages/About';

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
  console.log('is imported = ', isImported);
  const isFetched = Store.useState(selectors.getIsFetched);

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
        console.log('trigger update');
        // request for update data
        setTimeout(async () => {
          await updateDb();
        }, 2000);
      }
    };
    loadDb();
  }, [isImported, isFetched]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route exact path="/" render={() => <Home />} />
            <Route exact path="/about" render={() => <About />} />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default AppShell;
