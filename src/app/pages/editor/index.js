import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { DatePicker } from "antd";

class EditorPage extends PureComponent {
  render() {
    return (
      <div>
        <DatePicker />
      </div>
    );
  }
}

EditorPage.propTypes = {};

export default EditorPage;
