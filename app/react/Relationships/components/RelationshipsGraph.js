// TEST!!!
import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Sticky from 'react-sticky-el';
import Doc from 'app/Library/components/Doc';

import {fromJS} from 'immutable';

// import {switchView as switchViewAction} from '../actions/actions';

export class RelationshipsGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {collapsed: true};
    this.toggleCollapsed = this.toggleCollapsed.bind(this);
  }

  getRelationshipPosition(type) {
    const posIndex = this.props.relationTypes.findIndex(r => r.get('_id') === type);
    const numberOfConnectionColors = 19;
    return posIndex % (numberOfConnectionColors - 1);
  }

  prepareData() {
    const {connections} = this.props;

    let previousConnectionType = '';
    const amountOfTypes = connections.get('rows').reduce((_amount, _connection) => {
      return _connection.get('connections').reduce((_innerAmount, relationship) => {
        const newType = previousConnectionType !== relationship.get('context');
        previousConnectionType = relationship.get('context');
        return newType ? _innerAmount + 1 : _innerAmount;
      }, _amount);
    }, 0);

    previousConnectionType = '';
    let currentType = 0;

    const relationships = connections.get('rows').reduce((results, _connection) => {
      const connection = _connection.toJS();
      const entityConnections = connection.connections;
      const entity = Object.assign({}, connection);
      delete entity.connections;

      entityConnections.forEach(relationship => {
        const asPrevious = previousConnectionType === relationship.context;
        if (!asPrevious) {
          currentType += 1;
        }

        results.push(Object.assign({
          relationship: Object.assign(relationship, {typePostition: this.getRelationshipPosition(relationship.context)}),
          lastOfType: currentType === amountOfTypes,
          asPrevious
        }, entity));
        previousConnectionType = relationship.context;
      });

      return results;
    }, []);

    return relationships;
  }

  toggleCollapsed() {
    this.setState({collapsed: !this.state.collapsed});
  }

  render() {
    const {parentEntity, search, relationTypes} = this.props;
    const relationships = this.prepareData();
    console.log('relationships:', relationships);
    console.log('relationTypes:', relationTypes.toJS());

    return (
      <div className="relationships-graph">
        <div>
          <button onClick={this.toggleCollapsed} className="btn btn-default">{this.state.collapsed ? 'Expand' : 'Collapse'}</button>
        </div>
        <div className="group-wrapper">
          <div className={`group ${this.state.collapsed ? 'group-collapse' : ''}`}>
            <div className="group-row">

              <Sticky scrollElement=".entity-viewer" boundaryElement=".group-row" hideOnBoundaryHit={false}>
                <div className="source">
                  <Doc doc={parentEntity} searchParams={search} />
                  <div className="item-connection">
                    <figure className="hub"></figure>
                    <div className="connection-data">
                      <p className="connection-type connection-type-18">Relationships</p>
                    </div>
                  </div>
                </div>
              </Sticky>

              <div className="target-connections">
                {relationships.map((entity, index) => {
                  return (
                    <div className={`connection ${entity.asPrevious ? 'as-previous' : ''} ${entity.lastOfType ? 'last-of-type' : ''}`}
                         key={index}>
                      <div className="connection-data">
                        <p className={`connection-type connection-type-${entity.relationship.typePostition}`}>
                          <span>{entity.relationship.label}</span>
                        </p>
                      </div>
                      <Doc doc={fromJS(entity)} searchParams={search} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RelationshipsGraph.propTypes = {
  parentEntity: PropTypes.object,
  connections: PropTypes.object,
  search: PropTypes.object,
  relationTypes: PropTypes.object
};

export function mapStateToProps({entityView, connectionsList, relationTypes}) {
  return {
    parentEntity: entityView.entity,
    connections: connectionsList.searchResults,
    search: connectionsList.sort,
    relationTypes
  };
}

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({
//     switchView: switchViewAction
//   }, dispatch);
// }

export default connect(mapStateToProps)(RelationshipsGraph);
