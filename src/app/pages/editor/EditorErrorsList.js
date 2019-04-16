import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { Alert } from "antd";

class EditorErrorsList extends PureComponent {
  render() {
    if (!this.props.errors || !this.props.errors.length) {
      return null;
    }

    return (
      <div>
        {this.props.errors.map(({ message }, index) => (
          <Alert key={index} message={message} type="error" showIcon />
        ))}
      </div>
    );
  }
}

EditorErrorsList.propTypes = {
  errors: PropTypes.array.isRequired
};

export default EditorErrorsList;
