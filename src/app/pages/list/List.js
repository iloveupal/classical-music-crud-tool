import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";

import {
  SEARCH_STATUS_PROGRESS,
  SEARCH_STATUS_RESULTS,
  SEARCH_STATUS_NEW
} from "app/pages/list/ListConstants";
import Loading from "app/ui/loading";

import "./styles/list.less";

class List extends PureComponent {
  _renderResults(Component) {
    return (
      <div className={"compositions-list"} onScroll={this._handleScroll}>
        {this.props.items.map(item => {
          return (
            <Component
              data={item}
              key={item._id}
              onEdit={this.props.onEditItem}
              onDelete={this.props.onDeleteItem}
            />
          );
        })}
      </div>
    );
  }

  render() {
    const Component = this.props.component;

    return (
      <Fragment>
        {this._renderResults(Component)}
        {this.props.status === SEARCH_STATUS_PROGRESS && <Loading />}
      </Fragment>
    );
  }
}

List.propTypes = {
  items: PropTypes.array.isRequired,
  status: PropTypes.oneOf([
    SEARCH_STATUS_PROGRESS,
    SEARCH_STATUS_RESULTS,
    SEARCH_STATUS_NEW
  ]).isRequired,
  component: PropTypes.func.isRequired,
  onEditItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired
};

export default List;
