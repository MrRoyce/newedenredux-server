'use strict';

import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';

import {setLeaderBoard, nextPair, totalCharacters, incrementWins, setEntries} from '../src/core';

import {Characters} from './constants/characters';

describe('Home Page', () => {

  describe('setEntries', () => {
    it('returns the home page object', () => {
      const state = Map();

      // Pass an array of characters
      const entries = {characters: [Characters.THREATTY, Characters.XANTCHA, Characters.AMELIA, Characters.BUNIE, Characters.MIKAN, Characters.MIN, Characters.PROFESSOR, Characters.N3CRO, Characters.TANK]};

      const nextState = setEntries(state, entries);

      expect(nextState.get('top5Characters').size).to.equal(5);
      expect(nextState.get('numCharacters')).to.equal(9);
      expect(nextState.get('pair').size).to.equal(2);
      expect(nextState.get('characters').size).to.equal(9);
      //expect(nextState.get('stats').size).to.equal(1);

    });
  });

  describe('setLeaderBoard', () => {

    it('creates the top 5 characters leaderboard', () => {
      const state = Map();
      const top5Characters = List.of(Characters.THREATTY, Characters.XANTCHA, Characters.AMELIA, Characters.BUNIE, Characters.MIKAN, Characters.MIN, Characters.PROFESSOR, Characters.N3CRO, Characters.TANK);

      const nextState = setLeaderBoard(state, top5Characters);

      expect(nextState).to.equal(Map({
        top5Characters: List.of(Characters.XANTCHA, Characters.MIKAN, Characters.AMELIA, Characters.BUNIE, Characters.MIN)
      }));
    });

    it('converts to immutable', () => {
      const state = Map();
      const top5Characters = [Characters.XANTCHA, Characters.AMELIA, Characters.BUNIE, Characters.MIKAN, Characters.MIN, Characters.PROFESSOR, Characters.N3CRO, Characters.TANK];
      const nextState = setLeaderBoard(state, top5Characters);
      expect(nextState).to.equal(Map({
        top5Characters: List.of(Characters.XANTCHA, Characters.MIKAN, Characters.AMELIA, Characters.BUNIE, Characters.MIN)
      }));
    });

    it('returns exactly 5 characters', () => {
      const state = Map();
      const top5Characters = fromJS([Characters.XANTCHA, Characters.AMELIA, Characters.BUNIE, Characters.MIKAN, Characters.MIN, Characters.PROFESSOR]);
      const nextState = setLeaderBoard(state, top5Characters);
      expect(nextState.get('top5Characters').size).to.equal(5);
    });

  });

  describe('totalCharacters', () => {
    it('returns the total number of characters in the list', () => {
      const state = fromJS({
        entries: [Characters.XANTCHA, Characters.AMELIA, Characters.BUNIE, Characters.MIKAN, Characters.MIN, Characters.PROFESSOR]
      });

      const nextState = totalCharacters(state);

      expect(nextState).to.equal(fromJS({
        numCharacters: 6,
        entries: [Characters.XANTCHA, Characters.AMELIA, Characters.BUNIE, Characters.MIKAN, Characters.MIN, Characters.PROFESSOR]
      }));
    });
  });

  describe('nextPair', () => {

    it('takes the next two entries under vote', () => {
      const state = fromJS({
        entries: [Characters.XANTCHA, Characters.AMELIA, Characters.BUNIE, Characters.MIKAN, Characters.MIN, Characters.PROFESSOR]
      });

      const nextState = nextPair(state);

      expect(nextState).to.equal(fromJS({
        pair: [Characters.XANTCHA, Characters.AMELIA],
        entries: [Characters.BUNIE, Characters.MIKAN, Characters.MIN, Characters.PROFESSOR]
      }));
    });

  });

  describe('incrementWins', () => {

    it('increments wins for the voted entry', () => {
      const state = fromJS({

          pair: [Characters.XANTCHA, Characters.AMELIA]

      });

      const nextState = incrementWins(state, 'Xantcha', 'Amelia');

      expect(nextState).to.equal(fromJS({

          pair: [Characters.XANTCHA, Characters.AMELIA],
          tally: {
            'Xantcha': 1,
            'Amelia': 1
          }

      }));
    });

  });

  describe('addToTally', () => {

    it('adds to existing tally for the voted entry', () => {

      const state = fromJS({

          pair: [Characters.XANTCHAX, Characters.AMELIA],
          tally: {
            'Xantcha1': Characters.XANTCHAX.wins,
            'Amelia': Characters.AMELIA.losses
          }

      });

      const nextState = incrementWins(state, 'Xantcha1', 'Amelia');

      expect(nextState).to.equal(fromJS({

          pair: [Characters.XANTCHAX, Characters.AMELIA],
          tally: {
            'Xantcha1': Characters.XANTCHAX.wins + 1,
            'Amelia': Characters.AMELIA.losses + 1
          }

      }));
    });

  });

});
