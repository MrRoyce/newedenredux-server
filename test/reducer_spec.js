'use strict';

import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';

import reducer from '../src/reducer';

import {Characters} from './constants/characters';

describe('reducer', () => {

    it('handles SET_ENTRIES', () => {
      const initialState = Map();

      // Pass an array of characters
      const action = {type: 'SET_ENTRIES', entries : {characters: [Characters.THREATTY, Characters.XANTCHA, Characters.AMELIA, Characters.BUNIE, Characters.MIKAN, Characters.MIN, Characters.PROFESSOR, Characters.N3CRO, Characters.TANK]}};

      const nextState = reducer(initialState, action);

      expect(nextState.get('top5Characters').size).to.equal(5);
      expect(nextState.get('numCharacters')).to.equal(9);
      expect(nextState.get('pair').size).to.equal(2);
      expect(nextState.get('characters').size).to.equal(9);
    });

  it('handles SET_LEADERBOARD', () => {
    const initialState = Map();
    const action = {type: 'SET_LEADERBOARD', top5Characters: [Characters.XANTCHA, Characters.AMELIA, Characters.BUNIE, Characters.MIKAN, Characters.MIN, Characters.PROFESSOR]};
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(Map({
      top5Characters: List.of(Characters.XANTCHA, Characters.MIKAN, Characters.AMELIA, Characters.BUNIE, Characters.MIN)
    }));
  });

  it('handles NEXT_PAIR', () => {
    const initialState = fromJS({
        entries: [Characters.XANTCHA, Characters.AMELIA, Characters.BUNIE, Characters.MIKAN, Characters.MIN, Characters.PROFESSOR]
      });
    const action = {type: 'NEXT_PAIR'};
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      pair: [Characters.XANTCHA, Characters.AMELIA],
      entries: [Characters.BUNIE, Characters.MIKAN, Characters.MIN, Characters.PROFESSOR]
    }));
  });

  it('handles TOTAL_CHARACTERS', () => {
    const initialState = [Characters.XANTCHA, Characters.AMELIA, Characters.BUNIE, Characters.MIKAN, Characters.MIN, Characters.PROFESSOR];
    const action = {type: 'TOTAL_CHARACTERS'};
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      numCharacters: 6,
      entries: [Characters.XANTCHA, Characters.AMELIA, Characters.BUNIE, Characters.MIKAN, Characters.MIN, Characters.PROFESSOR]
    }));
  });

  it('handles INCREMENT_WINS', () => {
    const initialState = fromJS({
        vote: {
          pair: [Characters.XANTCHAX, Characters.AMELIA],
          tally: {
            'Xantcha1': Characters.XANTCHAX.wins,
            'Amelia': Characters.AMELIA.losses
          }
        }
      });
    const action = {type: 'INCREMENT_WINS', winner: 'Xantcha1', loser: 'Amelia'};
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
        vote: {
          pair: [Characters.XANTCHAX, Characters.AMELIA],
          tally: {
            'Xantcha1': Characters.XANTCHAX.wins + 1,
            'Amelia': Characters.AMELIA.losses + 1
          }
        }
    }));
  });

  it('has an initial state', () => {
    const action = {type: 'SET_LEADERBOARD', top5Characters: [Characters.XANTCHA, Characters.AMELIA, Characters.BUNIE, Characters.MIKAN, Characters.MIN, Characters.PROFESSOR]};
    const nextState = reducer(undefined, action);
    expect(nextState).to.equal(Map({
      top5Characters: List.of(Characters.XANTCHA, Characters.MIKAN, Characters.AMELIA, Characters.BUNIE, Characters.MIN)
    }));
  });

  it('can be used with reduce', () => {
      const actions = [
        {type: 'SET_LEADERBOARD', top5Characters: [Characters.THREATTY, Characters.XANTCHA, Characters.AMELIA, Characters.BUNIE, Characters.MIKAN, Characters.MIN, Characters.PROFESSOR, Characters.N3CRO, Characters.TANK]}
      ];

      const finalState = actions.reduce(reducer, Map());

      expect(finalState).to.equal(Map({
      top5Characters: List.of(Characters.XANTCHA, Characters.MIKAN, Characters.AMELIA, Characters.BUNIE, Characters.MIN)
      }));
  });

});
