/*
 * Integrate the Socket.io server and the Redux
 * state container (store)
 */

import makeStore   from './src/store';
import startServer from './src/server';
import getEntries  from './src/database';

export const store = makeStore();

getEntries((err, entries) => {

    if (err) {
        console.log(err);
    } else {
        //  Pass the store to the server
        //console.log(entries);
        startServer(store);

        // Load initial data
        store.dispatch({
          type    : 'SET_ENTRIES',
          entries : entries
        });
    }

});
