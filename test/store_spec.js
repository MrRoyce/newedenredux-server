'use strict';

import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';

import makeStore from '../src/store';

import {Characters} from './constants/characters';

describe('store', () => {

  it('is a Redux store configured with the correct reducer', () => {
    const store = makeStore();
    expect(store.getState()).to.equal(Map());

    store.dispatch({
      type: 'SET_LEADERBOARD',
      top5Characters: [Characters.XANTCHA, Characters.AMELIA, Characters.BUNIE, Characters.MIKAN, Characters.MIN, Characters.PROFESSOR, Characters.N3CRO, Characters.TANK]
    });
    expect(store.getState()).to.equal(Map({
      top5Characters: List.of(Characters.XANTCHA, Characters.MIKAN, Characters.AMELIA, Characters.BUNIE, Characters.MIN)
    }));
  });

});
