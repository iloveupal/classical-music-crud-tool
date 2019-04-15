import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { Input } from "antd";

const Search = Input.Search;

import {
  SEARCH_STATUS_PROGRESS,
  SEARCH_STATUS_RESULTS,
  SEARCH_STATUS_NEW
} from "app/pages/list/ListConstants";

class ListSearchBar extends PureComponent {
  render() {
    return (
      <div>
        <Search
          type={"search"}
          placeholder={`Type in query like text=Bergamasque;year=1984`}
          onSearch={this.props.onSearch}
          enterButton={true}
          disabled={this.props.status === SEARCH_STATUS_PROGRESS}
        />
      </div>
    );
  }
}

ListSearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  status: PropTypes.oneOf([
    SEARCH_STATUS_PROGRESS,
    SEARCH_STATUS_RESULTS,
    SEARCH_STATUS_NEW
  ]).isRequired
};

export default ListSearchBar;
