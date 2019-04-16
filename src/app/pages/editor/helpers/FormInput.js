import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import "./styles/form-input.less";

class FormInput extends PureComponent {
  render() {
    return (
      <div className={"editor-page-form-input"}>
        <span className={"editor-page-form-input__name"}>
          {this.props.name}
        </span>
        {this.props.children}
      </div>
    );
  }
}

FormInput.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default FormInput;
