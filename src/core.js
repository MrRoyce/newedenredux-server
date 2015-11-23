/*
 * Core application functions
 */

'use strict';

import {List, Map, fromJS} from 'immutable';

export const INITIAL_STATE = Map();

// Create the initial home page from an array of characters
export function setEntries(state, entries) {

  return state.set('top5Characters', List(entries).sort((a, b) => {
    return b.wins - a.wins;  // Sort descending by wins
  }).take(5)
  ).set('numCharacters', List(entries).size)
   .set('vote', List(entries).take(2))
  ;

}

// Gets the top 5 characters for the leaderboard
export function setLeaderBoard(state, entries) {

  // Sort the entries
  return state.set('top5Characters', List(entries).sort((a, b) => {
    return b.wins - a.wins;
  }).take(5));
}

// Gets the next 2 entries from the list
export function nextPair(state) {
  const entries = state.get('entries');
  return state.merge({
    vote: Map({pair: entries.take(2)}),
    entries: entries.skip(2)
  });
}

// Get the total number of characters in the list
export function totalCharacters(st) {

    let entries, state, size = 0;

    if (Map.isMap(st)) {
        state = st;
        entries = st.get('entries');
        size = entries.size;
    } else {  // just an array was passed
        state = Map();
        entries = fromJS(st);
        size = entries.size;
    }

  return state.merge({
    numCharacters: size,
    entries: entries
  });
}

// Increment wins for winner and losses for loser
export function incrementWins(voteState, winner, loser) {

  return voteState.updateIn(
    ['tally', winner],
    0,
    tally => tally + 1
  ).updateIn(
    ['tally', loser],
    0,
    tally => tally + 1
  );
}
