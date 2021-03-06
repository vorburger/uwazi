import Immutable from 'immutable';
import * as types from 'app/Uploads/actions/actionTypes';

import progressReducer from 'app/Uploads/reducers/progressReducer';
import 'jasmine-immutablejs-matchers';

describe('uploadsReducer', () => {
  const initialState = Immutable.fromJS({});

  describe('when state is undefined', () => {
    it('should return default state', () => {
      const newState = progressReducer();
      expect(newState).toEqual(initialState);
    });
  });

  describe('NEW_UPLOAD_DOCUMENT', () => {
    it('should set the progress for the document to 0', () => {
      const currentState = Immutable.fromJS({ doc1: 45 });
      const newState = progressReducer(currentState, { type: types.NEW_UPLOAD_DOCUMENT, doc: 'doc2' });
      expect(newState).toEqualImmutable(Immutable.fromJS({ doc1: 45, doc2: 0 }));
    });
  });

  describe('UPLOAD_PROGRESS', () => {
    it('should set the progress for a document', () => {
      const currentState = Immutable.fromJS({ doc1: 45 });
      const newState = progressReducer(currentState, { type: types.UPLOAD_PROGRESS, doc: 'doc2', progress: 36 });
      expect(newState).toEqualImmutable(Immutable.fromJS({ doc1: 45, doc2: 36 }));
    });
  });

  describe('UPLOAD_COMPLETE', () => {
    it('should unset upload progress for the document', () => {
      const currentState = Immutable.fromJS({ doc1: 45, doc2: 55 });
      const newState = progressReducer(currentState, { type: types.UPLOAD_COMPLETE, doc: 'doc1' });
      expect(newState).toEqualImmutable(Immutable.fromJS({ doc2: 55 }));
    });
  });
});
