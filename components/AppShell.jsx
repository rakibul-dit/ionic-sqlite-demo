import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';
import Menu from './Menu';
import { useSQLite } from 'react-sqlite-hook';
import { useEffect, useState } from 'react';
import { Storage } from '@ionic/storage';
import { fullImportFromJson, updateDb } from './db-utils/jsonImport';
import { setIsImportedGl } from '../store/actions';
import Store from '../store';
import * as selectors from '../store/selectors';
import Home from './pages/Home';
import About from './pages/About';
import Users from './pages/Users';
import Messages from './pages/Messages';
import Tafsir from './pages/Tafsir';
import Tafsirs from './pages/Tafsirs';

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
    importFromJson,
    isJsonValid,
    isAvailable,
    retrieveConnection,
  } = useSQLite();
  sqlite = {
    echo: echo,
    getPlatform: getPlatform,
    createConnection: createConnection,
    closeConnection: closeConnection,
    importFromJson: importFromJson,
    isJsonValid: isJsonValid,
    isAvailable: isAvailable,
    retrieveConnection: retrieveConnection,
  };

  const [isImported, setIsImported] = useState();
  console.log('is imported = ', isImported);
  const isTriggerUpdate = Store.useState(selectors.getIsTriggerUpdate);

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
    };
    loadDb();
  }, [isImported]);

  useEffect(() => {
    const triggerUpdate = async () => {
      // db is imported & user is in online
      if (isTriggerUpdate === true && navigator.onLine) {
        console.log('trigger update');
        // request for update data
        // setTimeout(async () => {
        await updateDb();
        // }, 2000);
      } else {
        console.log('offline');
      }
    };
    triggerUpdate();
  }, [isTriggerUpdate]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route exact path="/" render={() => <Home />} />
            <Route exact path="/users" render={() => <Users />} />
            <Route exact path="/messages" render={() => <Messages />} />
            <Route exact path="/tafsirs" render={() => <Tafsirs />} />
            <Route exact path="/tafsirs/:id" render={props => <Tafsir {...props} />} />
            <Route exact path="/about" render={() => <About />} />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default AppShell;
