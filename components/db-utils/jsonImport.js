import { dataToImport } from './jsonData';
import { sqlite } from '../AppShell';
import { Storage } from '@ionic/storage';
import { setIsUpdatedGl } from '../../store/actions';

const store = new Storage();
store.create();

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

const fetchServerSyncDate = async () => {
  const response = await fetch(
    'https://deeniinfotech.sgp1.digitaloceanspaces.com/files/amar-zakat/lastUpdate.xml',
    {
      method: 'GET',
      headers,
    }
  )
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, 'application/xml');
      return xml.getElementsByTagName('lastUpdate')[0].childNodes[0].nodeValue;
    })
    .catch(console.error);
  return response;
};

const fetchUpdatedJson = async () => {
  const response = await fetch(
    'https://deeniinfotech.sgp1.digitaloceanspaces.com/files/amar-zakat/jsonData2.js',
    {
      method: 'GET',
      headers,
    }
  ).then(data => data.json());
  return await response;
};

export const fullImportFromJson = async _ => {
  try {
    // test Json object validity
    let res = await sqlite.isJsonValid(JSON.stringify(dataToImport));
    if (!res.result) {
      console.log('json data is not valid');
      return false;
    }

    // test import from Json Object
    res = await sqlite.importFromJson(JSON.stringify(dataToImport));
    console.log(`import result ${res.changes.changes}`);
    if (res.changes.changes === -1) {
      console.log(`import unsuccessfull`);
      return false;
    }
    console.log(`import successfull`);

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

    console.log('$$ syncDate ' + res);
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
    setIsUpdatedGl(false);

    let db = await sqlite.createConnection('db-from-json', false, 'no-encryption', 1);
    await db.open();
    // get the local synchronization date
    let localSyncDate = await db.getSyncDate();
    console.log('local', localSyncDate);
    await db.close();
    if (!localSyncDate) {
      return false;
    }
    // fetch server syncDate
    let serverSyncDate = await fetchServerSyncDate();
    console.log('server', serverSyncDate);

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
      console.log(`update result ${res.changes.changes}`);
      if (res.changes.changes === -1) {
        console.log(`update unsuccessfull`);
        return false;
      }
      console.log(`update successfull`);

      await db.open();
      //** need to change here in real project */
      // await db.setSyncDate(new Date().toISOString());
      await db.setSyncDate(serverSyncDate);

      res = await db.query('SELECT * FROM users;');
      console.log(res.values);
      await db.close();
      await sqlite.closeConnection('db-from-json');
      setIsUpdatedGl(true);

      return true;
    } else {
      setIsUpdatedGl(undefined);
      return false;
    }
  } catch (err) {
    setIsUpdatedGl(undefined);
    console.log(err);
    return false;
  }
};
