/*
 * Core application functions
 */

'use strict';

import {List, Map, fromJS} from 'immutable';

export const INITIAL_STATE = Map();

function randomIntFromInterval(min, max) {
  /*console.log('min: ' + min);
  console.log('max: ' + max);
  console.log('val: ' + Math.floor(Math.random() * (max - min + 1) + min));*/
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Create the initial home page from an array of characters
export function setEntries(state, entries) {

  let
    listEntries = List(entries.characters),
    stats       = entries.stats,
    males       = listEntries.filter(x => x.gender === 'Male'),
    females     = listEntries.filter(x => x.gender === 'Female'),
    taken;

  //console.log('stats');  console.log(JSON.stringify(stats));

  // Randomly show a male or female pair
  if (Math.random() >= 0.5) {
    taken = males.skip(randomIntFromInterval(0, (males.size - 2.0))).take(2);
  } else {
    taken = females.skip(randomIntFromInterval(0, (females.size - 2.0))).take(2);
  }
  return state.set('top5Characters', listEntries.sort((a, b) => {
    return b.wins - a.wins;  // Sort descending by wins
  }).take(5)
  ).set('numCharacters', listEntries.size)
   .set('pair', taken)
   .set('characters', listEntries)  // return all the entries
   .set('stats', stats)  // return all the entries
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
    pair: entries.take(2),
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
