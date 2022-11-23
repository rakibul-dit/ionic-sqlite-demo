import { sqlite } from '../AppShell';
import { Storage } from '@ionic/storage';
import { setIsUpdatedGl } from '../../store/actions';

const store = new Storage();
store.create();

const fetchServerSyncDate = async () => {
  const response = await fetch('https://next-api-sqlite-demo.vercel.app/api/last-update', {
    method: 'GET',
  })
    .then(response => response.json())
    .catch(console.error);
  return response.lastUpdate;
};

const fetchUpdatedJson = async () => {
  const response = await fetch('https://next-api-sqlite-demo.vercel.app/api/updated-data', {
    method: 'GET',
  }).then(data => data.json());
  return await response;
};

const fetchImportData = async () => {
  const response = await fetch('https://next-api-sqlite-demo.vercel.app/api/import-data', {
    method: 'GET',
  }).then(data => data.json());
  return await response;
};

export const fullImportFromJson = async _ => {
  try {
    let dataToImport = await fetchImportData();
    // test Json object validity
    let res = await sqlite.isJsonValid(JSON.stringify(dataToImport));
    if (!res.result) {
      console.log('json data is not valid');
      return false;
    }

    // test import from Json Object
    res = await sqlite.importFromJson(JSON.stringify(dataToImport));
    console.log('import result =', res.changes.changes);
    if (res.changes.changes === -1) {
      console.log('import unsuccessfull');
      return false;
    }
    console.log('import successfull');

    let db = await sqlite.createConnection('db-from-json', false, 'no-encryption', 1);
    await db.open();
    res = await db.createSyncTable();
    if (res.changes.changes < 0) {
      console.log('createSyncTable error');
      return false;
    }
    // get the synchronization date
    res = await db.getSyncDate();
    if (res.syncDate === 0) {
      return false;
    }

    console.log('syncDate ' + res);
    await db.close();
    await sqlite.closeConnection('db-from-json');

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

// fetch syncDate and compare with local syncDate
// if server syncDate is greater, fetch partial json
export const updateDb = async _ => {
  try {
    // fetch server syncDate
    let serverSyncDate = await fetchServerSyncDate();
    console.log('server', serverSyncDate);

    let db = await sqlite.createConnection('db-from-json', false, 'no-encryption', 1);
    // let db = await sqlite.retrieveConnection('db-from-json');
    await db.open();
    // get the local synchronization date
    let localSyncDate = await db.getSyncDate();
    console.log('local', localSyncDate);
    await db.close();
    await sqlite.closeConnection('db-from-json');

    if (!localSyncDate) {
      return false;
    }

    if (new Date(serverSyncDate) > new Date(localSyncDate)) {
      // fetch updated data
      let partialData = await fetchUpdatedJson();
      console.log(partialData);

      // Json object validity
      let res = await sqlite.isJsonValid(JSON.stringify(partialData));
      if (!res.result) {
        return false;
      }

      // import from Json Object
      res = await sqlite.importFromJson(JSON.stringify(partialData));
      console.log('update result =', res.changes.changes);
      if (res.changes.changes === -1) {
        console.log('update unsuccessfull');
        return false;
      }
      console.log('update successfull');

      let db = await sqlite.createConnection('db-from-json', false, 'no-encryption', 1);
      await db.open();
      await db.setSyncDate(new Date(serverSyncDate).toISOString());
      // await db.setSyncDate(serverSyncDate);

      // res = await db.query('SELECT * FROM users;');
      // console.log(res.values);
      await db.close();
      await sqlite.closeConnection('db-from-json');
      setIsUpdatedGl(true);

      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};
