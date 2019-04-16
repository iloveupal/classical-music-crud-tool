/**
 * A component for handling array type of input.
 */

import _debounce from "lodash/debounce";
import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { Button } from "antd";

import FormInput from "./FormInput";
import InputSlow from "./InputSlow";

import "./styles/array-input.less";
import { EDITOR_ENTITY_MOVEMENT } from "app/pages/editor/EditorConstants";
import { ColorLink } from "app/ui/link";

class ArrayInput extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value || []
    };
  }

  componentDidUpdate(oldProps) {
    if (oldProps.value !== this.props.value) {
      this.setState({
        value: this.props.value || []
      });
    }
  }

  _handleChange = ({ field, indexToUpdate }) => value => {
    this.setState({
      value: this.state.value.map((item, index) => {
        if (index === indexToUpdate) {
          return {
            ...item,
            [field]: value
          };
        }

        return item;
      })
    });

    this._triggerSendEvent();
  };

  _handleAdd = () => {
    this.setState({
      value: (this.state.value || []).concat([{}])
    });
  };

  _handleDelete = indexToDelete => () => {
    this.setState({
      value: this.state.value.filter((val, index) => indexToDelete !== index)
    });

    this._triggerSendEvent();
  };

  _triggerSendEvent = _debounce(() => {
    this.props.onChange(this.state.value);
  }, 1500);

  render() {
    const { onChange, fields, addButtonLabel } = this.props;

    const { value } = this.state;

    return (
      <div className={"editor-page-array-input"}>
        {value.map((item, index) => {
          return (
            <div key={index} className={"editor-page-array-input__item"}>
              <div className={"editor-page-array-input__item-header"}>
                {`${index + 1}.`}

                <ColorLink type={"danger"} onClick={this._handleDelete(index)}>
                  Delete
                </ColorLink>
              </div>
              {fields.map(field => {
                return (
                  <FormInput key={field} name={field}>
                    <InputSlow
                      value={item[field]}
                      onChange={this._handleChange({
                        field,
                        indexToUpdate: index
                      })}
                    />
                  </FormInput>
                );
              })}
            </div>
          );
        })}
        <div className={"editor-page-array-input__add"}>
          <Button type={"dashed"} onClick={this._handleAdd}>
            {addButtonLabel}
          </Button>
        </div>
      </div>
    );
  }
}

ArrayInput.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  fields: PropTypes.array.isRequired,
  addButtonLabel: PropTypes.string.isRequired
};

ArrayInput.defaultProps = {
  value: []
};

export default ArrayInput;
