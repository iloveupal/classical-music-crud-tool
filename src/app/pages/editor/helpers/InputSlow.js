/**
 will only send an onChange event after certain timeout
*/

import _debounce from "lodash/debounce";

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Input, InputNumber } from "antd";

const DEBOUNCE_TIME = 1500;

class InputSlow extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value
    };
  }

  componentDidUpdate(oldProps) {
    if (oldProps.value !== this.props.value) {
      this.setState({
        value: this.props.value
      });
    }
  }

  _triggerSendEvent = _debounce(() => {
    this.props.onChange(this.state.value);
  }, DEBOUNCE_TIME);

  _handleChange = event => {
    const newVal = event.target.value;

    this.setState({
      value: newVal
    });

    this._triggerSendEvent();
  };

  _handleNumericChange = newVal => {
    this.setState({
      value: newVal
    });

    this._triggerSendEvent();
  };

  render() {
    const { numeric, value, onChange, ...props } = this.props;

    return numeric ? (
      <InputNumber
        {...props}
        value={this.state.value}
        onChange={this._handleNumericChange}
      />
    ) : (
      <Input
        {...props}
        value={this.state.value}
        onChange={this._handleChange}
      />
    );
  }
}

InputSlow.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  numeric: PropTypes.bool
};

export default InputSlow;
