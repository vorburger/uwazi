import { fromJS as Immutable } from 'immutable';
import * as attachmentsTypes from 'app/Attachments/actions/actionTypes';

const getId = (state, setInArray) => state.getIn(setInArray.concat(['_id']));

const getAttachments = (state, setInArray) => state.getIn(setInArray.concat(['attachments'])) || Immutable([]);

export default function manageAttachmentsReducer(originalReducer, { useDefaults = true, setInArray = [] } = {}) {
  return (orignialState, originalAction) => {
    let state = orignialState;
    const action = originalAction || {};

    if (useDefaults) {
      state = orignialState || {};
    }

    if (action.type === attachmentsTypes.ATTACHMENT_COMPLETE && getId(state, setInArray) === action.entity) {
      const attachments = getAttachments(state, setInArray);
      return state.setIn(setInArray.concat(['attachments']), attachments.push(Immutable(action.file)));
    }

    if (action.type === attachmentsTypes.ATTACHMENT_DELETED && getId(state, setInArray) === action.entity) {
      const attachments = getAttachments(state, setInArray);
      const mainFile = state.getIn(setInArray.concat(['file'])) || Immutable({});
      const deleteMainFile = mainFile.get('filename') === action.file.filename;
      const newState = deleteMainFile ? state.setIn(setInArray.concat(['file']), null) : state;
      return newState.setIn(setInArray.concat(['attachments']), attachments.filterNot(a => a.get('filename') === action.file.filename));
    }

    if (action.type === attachmentsTypes.ATTACHMENT_RENAMED && getId(state, setInArray) === action.entity) {
      if (getId(state, setInArray) === action.file._id) {
        return state.setIn(setInArray.concat(['file']), Immutable(action.file));
      }

      const attachments = getAttachments(state, setInArray);
      return state.setIn(setInArray.concat(['attachments']), attachments.map((a) => {
        if (a.get('_id') === action.file._id) {
          return a.set('originalname', action.file.originalname);
        }

        return a;
      }));
    }

    return originalReducer(state, action);
  };
}
