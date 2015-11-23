'use strict';

import {setLeaderBoard, nextPair, totalCharacters, incrementWins, setEntries, INITIAL_STATE} from './core';

export default function reducer(state = INITIAL_STATE, action) {

  switch (action.type) {
    case 'SET_ENTRIES':
        return setEntries(state, action.entries);
    case 'SET_LEADERBOARD':
        return setLeaderBoard(state, action.top5Characters);
    case 'NEXT_PAIR':
        return nextPair(state);
    case 'TOTAL_CHARACTERS':
        return totalCharacters(state);
    case 'INCREMENT_WINS':
        return state.update('vote', voteState => incrementWins(voteState, action.winner, action.loser));
    default:
        break;
  }
  return state;
}
