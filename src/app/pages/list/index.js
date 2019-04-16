import _throttle from "lodash/throttle";

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withProps } from "recompose";

import { message } from "antd";

import { deleteComposition, listCompositions } from "app/api/compositions";
import { createEditorLink } from "app/utils/router";

import { parseSearchString, buildFiltersKey } from "./ListUtils";

import {
  SEARCH_STATUS_NEW,
  SEARCH_STATUS_PROGRESS,
  SEARCH_STATUS_RESULTS
} from "./ListConstants";

import ListSearchBar from "./ListSearchBar";
import List from "./List";
import CompositionListItem from "./CompositionListItem";

import "./styles/style.less";

export class ListPage extends PureComponent {
  state = {
    result: [],
    status: SEARCH_STATUS_NEW,
    searchKey: null,
    filters: {},
    offset: 0,
    isFinished: false
  };

  componentDidMount() {
    this._handleSearchStart("");
  }

  _startRequest({ filters }) {
    const searchKey = buildFiltersKey(filters);

    if (searchKey === this.state.searchKey) {
      return;
    }

    this.setState({
      offset: 0,
      isFinished: false,
      searchKey,
      filters,
      status: SEARCH_STATUS_PROGRESS,
      result: []
    });

    this.props
      .onGetCompositions({
        search: filters,
        offset: 0
      })
      .then(this._handleResponse);
  }

  _handleResponse = ({ result, success, errors, count }) => {
    if (!success) {
      this.setState({
        status: SEARCH_STATUS_RESULTS,
        isFinished: true
      });

      errors.forEach(error => this.props.onDisplayError(error));

      return;
    }

    this.setState(prevState => ({
      status: SEARCH_STATUS_RESULTS,
      isFinished: prevState.result.length + result.length >= count,
      offset: prevState.offset + result.length,
      result: (prevState.result || []).concat(result)
    }));
  };

  _handleLoadMore = _throttle(() => {
    if (this.state.isFinished || this.state.status === SEARCH_STATUS_PROGRESS) {
      return null;
    }

    this.setState({
      status: SEARCH_STATUS_PROGRESS
    });

    this.props
      .onGetCompositions({
        search: this.state.filters,
        offset: this.state.offset
      })
      .then(this._handleResponse);
  }, 1000);

  _handleEditItem = id => {
    this.props.onEditComposition(id);
  };

  _handleDeleteItem = id => {
    this.props.onDeleteComposition({ id }).then(({ success, errors }) => {
      if (errors.length) {
        errors.forEach(error => this.props.onDisplayError(error));
      } else {
        this.setState(prevState => ({
          result: prevState.result.filter(item => item._id !== id),
          offset: prevState.offset - 1
        }));
      }
    });
  };

  _handleSearchStart = search => {
    parseSearchString(search)
      .then(filters => this._startRequest({ filters }))
      .catch(error => {
        this.props.onDisplayError(error);
      });
  };

  _handleScroll = e => {
    const hasReachedBottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

    if (hasReachedBottom) {
      this._handleLoadMore();
    }
  };

  render() {
    const { result, status } = this.state;

    return (
      <div className={"pages-list-container"} onScroll={this._handleScroll}>
        <ListSearchBar status={status} onSearch={this._handleSearchStart} />
        <List
          items={result}
          status={status}
          component={CompositionListItem}
          onEditItem={this._handleEditItem}
          onDeleteItem={this._handleDeleteItem}
        />
      </div>
    );
  }
}

ListPage.propTypes = {
  onGetCompositions: PropTypes.func.isRequired,
  onEditComposition: PropTypes.func.isRequired,
  onDeleteComposition: PropTypes.func.isRequired,
  onDisplayError: PropTypes.func.isRequired
};

export default withProps(props => ({
  onGetCompositions: listCompositions,
  onDeleteComposition: deleteComposition,
  onDisplayError: error => message.warn(error.message),
  onEditComposition: id => props.history.push(createEditorLink(id), {})
}))(ListPage);
