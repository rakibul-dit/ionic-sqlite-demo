import Head from 'next/head';
import {
  defineCustomElements as jeepSqlite,
  applyPolyfills,
  JSX as LocalJSX,
} from 'jeep-sqlite/loader';
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  CapacitorSQLiteWeb,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';

import 'tailwindcss/tailwind.css';
import '@ionic/react/css/core.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import '../styles/global.css';
import '../styles/variables.css';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    applyPolyfills().then(() => {
      jeepSqlite(window);
    });
    // window.addEventListener('DOMContentLoaded', async () => {
    const load = async () => {
      const platform = Capacitor.getPlatform();
      console.log(platform);
      const sqlite = new SQLiteConnection(CapacitorSQLite);
      try {
        if (platform === 'web') {
          const jeepEl = document.createElement('jeep-sqlite');
          document.body.appendChild(jeepEl);
          // await customElements.whenDefined('jeep-sqlite');
          await sqlite.initWebStore();
          console.log(sqlite.isWebStoreOpen);
          // jeepEl.isStoreOpen().then(v => console.log(v));
        }
      } catch (err) {
        console.log(`Error: ${err}`);
        throw new Error(`Error: ${err}`);
      }
    };
    load();
    // });
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        ></meta>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
