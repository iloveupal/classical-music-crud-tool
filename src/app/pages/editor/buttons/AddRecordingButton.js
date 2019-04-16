import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { Button } from "antd";

class AddRecordingButton extends PureComponent {
  render() {
    return (
      <div className={"editor-form-button-container"}>
        <Button type="dashed" onClick={this.props.onClick}>
          Add A Recording
        </Button>
      </div>
    );
  }
}

AddRecordingButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default AddRecordingButton;
