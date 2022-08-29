import { dataToImport, partialData, partialImport } from './jsonData';
import { sqlite } from '../AppShell';
import { Storage } from '@ionic/storage';
import { setIsUpdatedGl } from '../../store/actions';

const store = new Storage();
store.create();

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
    console.log(localSyncDate);
    await db.close();
    if (!localSyncDate) {
      return false;
    }
    // fetch server syncDate
    let serverSyncDate = await store.get('serverSyncDate');

    if (serverSyncDate > new Date(localSyncDate)) {
      // Json object validity
      let res = await sqlite.isJsonValid(JSON.stringify(partialImport));
      if (!res.result) {
        return false;
      }
      // import from Json Object
      res = await sqlite.importFromJson(JSON.stringify(partialImport));
      console.log(`update result ${res.changes.changes}`);
      if (res.changes.changes === -1) {
        console.log(`update unsuccessfull`);
        return false;
      }
      console.log(`update successfull`);
      await db.open();
      await db.setSyncDate(new Date().toISOString());
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
    console.log(err);
    return false;
  }
};
