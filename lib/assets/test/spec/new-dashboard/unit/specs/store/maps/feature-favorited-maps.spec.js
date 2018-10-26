import visualization from './fixtures/visualizations';
import FeaturedFavoritedMapsStore from 'new-dashboard/store/maps/featured-favorited-maps';
import toObject from 'new-dashboard/utils/to-object';
import { testAction } from '../helpers';

jest.mock('carto-node');

const mutations = FeaturedFavoritedMapsStore.mutations;
const actions = FeaturedFavoritedMapsStore.actions;

describe('FeaturedFavoritedMapsStore', () => {
  describe('mutations', () => {
    it('setRequestError', () => {
      let state = {
        isFetching: false,
        isErrored: false,
        error: {}
      };

      let err = {
        status: 404
      };
      mutations.setRequestError(state, err);

      expect(state).toEqual({
        isFetching: false,
        isErrored: true,
        error: err
      });
    });

    it('setFeaturedFavoritedMaps', () => {
      let state = {
        list: {},
        metadata: {},
        isFetching: true
      };

      mutations.setFeaturedFavoritedMaps(state, visualization);

      expect(state).toEqual({
        list: toObject(visualization.visualizations, 'id'),
        metadata: {
          total_entries: visualization.total_entries,
          total_likes: visualization.total_likes,
          total_shared: visualization.total_shared,
          total_user_entries: visualization.total_user_entries
        },
        isFetching: false
      });
    });

    it('setFetchingState', () => {
      let state = {
        isFetching: false,
        isErrored: false,
        error: {}
      };

      mutations.setFetchingState(state);

      expect(state).toEqual({
        isFetching: true,
        isErrored: false,
        error: {}
      });
    });
  });

  describe('actions', () => {
    describe('fetchMaps', () => {
      let state, maps;
      beforeEach(() => {
        state = {
          isFetching: false,
          isFiltered: false,
          isErrored: false,
          error: {},
          list: {},
          metadata: {},
          params: {
            per_page: 2,
            only_liked: true
          }
        };
        maps = {
          defaultParams: {
            exclude_shared: false,
            per_page: 1,
            shared: 'no',
            locked: false,
            only_liked: false,
            order: 'updated_at',
            types: 'derived',
            deepInsights: false
          }
        };
        state.maps = maps;
      });
      it('success', done => {
        testAction(actions.fetchMaps, null, state, [
          { type: 'setFetchingState' },
          { type: 'setFeaturedFavoritedMaps', payload: visualization }
        ], [], done);
      });

      it('errored', done => {
        state.maps.defaultParams.order = false;
        const err = { error: "Wrong 'order' parameter value. Valid values are one of [:updated_at, :size, :mapviews, :likes]" };

        testAction(actions.fetchMaps, null, state, [
          { type: 'setFetchingState' },
          { type: 'setRequestError', payload: err }
        ], [], done);
      });
    });
  });
});