/*
 * Copyright © HatioLab Inc. All rights reserved.
 */

import './util'

import { expect } from 'chai'

import '../../bower_components/things-scene-core/things-scene-min'
import { GoogleMap } from '../../src/index'

describe('GoogleMap', function () {

  var board;

  beforeEach(function () {
    board = scene.create({
      model: {
        components: [{
          id: 'google-map',
          type: 'google-map'
        }]
      }
    })
  });

  it('component should be found by its id.', function () {

    var component = board.findById('google-map')

    expect(!!component).not.to.equal(false);
  });
});
