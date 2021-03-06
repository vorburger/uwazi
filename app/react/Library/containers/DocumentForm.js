import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { wrapDispatch } from 'app/Multireducer';

import { saveDocument } from 'app/Library/actions/libraryActions';
import { actions, MetadataForm } from 'app/Metadata';

function mapStateToProps(state, props) {
  const { templates } = state;
  const { thesauris } = state;
  return {
    model: `${props.storeKey}.sidepanel.metadata`,
    isEntity: !state[props.storeKey].sidepanel.file,
    templateId: state[props.storeKey].sidepanel.metadata.template,
    templates,
    thesauris
  };
}

function mapDispatchToProps(dispatch, props) {
  return bindActionCreators({ changeTemplate: actions.changeTemplate, onSubmit: saveDocument }, wrapDispatch(dispatch, props.storeKey));
}

export default connect(mapStateToProps, mapDispatchToProps)(MetadataForm);
