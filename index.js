/*
 * Integrate the Socket.io server and the Redux
 * state container (store)
 */

import makeStore   from './src/store';
import startServer from './src/server';
import getEntries  from './src/database';

export const store = makeStore();

// Get all of the entries from the DB
// they will be correcty structured in core.js
getEntries((err, entries) => {

    if (err) {
        console.log(err);
    } else {
        //  Pass the store to the server
        /*console.log('totalCount ' + entries.stats.totalCount);
        console.log('amarrCount ' + entries.stats.amarrCount);
        console.log('caldariCount ' + entries.stats.caldariCount);
        console.log('gallenteCount ' + entries.stats.gallenteCount);
        console.log('minmatarCount ' + entries.stats.minmatarCount);
        console.log('maleCount ' + entries.stats.maleCount);
        console.log('femaleCount ' + entries.stats.femaleCount);
        console.log('totalVotes ' + entries.stats.totalVotes);
        console.log('leadingRace ' + JSON.stringify(entries.stats.leadingRace));
        console.log('leadingBloodline ' + JSON.stringify(entries.stats.leadingBloodline));*/
        startServer(store);

        // Load initial data
        store.dispatch({
          type    : 'SET_ENTRIES',
          entries : entries
        });
    }

});
