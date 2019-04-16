import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { Upload, Button, Icon } from "antd";

import { getApiRecordingUploadUrl } from "app/api/recordings";

class UploadRecordingButton extends PureComponent {
  _handleChange = ({ file }) => {
    const { status, response } = file;

    if (status === "done" && response.success === true) {
      this.props.onUpload(response.result.metadata);
    }
  };

  render() {
    const { recordingId } = this.props;

    return (
      <Upload
        action={getApiRecordingUploadUrl(recordingId)}
        accept={"audio/*"}
        name={"file"}
        onChange={this._handleChange}
      >
        <Button>
          <Icon type="upload" /> Upload a Recording
        </Button>
      </Upload>
    );
  }
}

UploadRecordingButton.propTypes = {
  recordingId: PropTypes.string.isRequired,
  onUpload: PropTypes.func.isRequired
};

export default UploadRecordingButton;
