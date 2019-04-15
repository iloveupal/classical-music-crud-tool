import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { getTitle, getKey, getRecordings } from "domains/movement/propGetters";

import { renderKey } from "domains/movement/utils";

import "./styles/movement-list-item.less";

class MovementListItem extends PureComponent {
  render() {
    const { data } = this.props;

    return (
      <div>
        <span className={"movement-list-item__title"}>{getTitle(data)}</span>
        <span className={"movement-list-item__key"}>
          {renderKey(getKey(data))}
        </span>
        <span className={"movement-list-item__recordings-count"}>
          {getRecordings(data).length} recordings found
        </span>
      </div>
    );
  }
}

MovementListItem.propTypes = {
  data: PropTypes.object.isRequired
};

export default MovementListItem;
