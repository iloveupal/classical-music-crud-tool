import _debounce from "lodash/debounce";
import _curry from "lodash/curry";

import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { Typography, Input } from "antd";

import {
  getComposer,
  getMovements,
  getTitle
} from "domains/composition/propGetters";

import {
  EDITOR_ENTITY_COMPOSITION,
  EDITOR_ENTITY_MOVEMENT,
  EDITOR_ENTITY_RECORDING,
  EDITOR_OPERATION_CREATE,
  EDITOR_OPERATION_DELETE,
  EDITOR_OPERATION_UPDATE
} from "app/pages/editor/EditorConstants";

import MovementEditorForm from "./MovementEditorForm";
import AddMovementButton from "./buttons/AddMovementButton";

const { Title } = Typography;

class EditorForm extends PureComponent {
  _makeChangeHandler = _curry((operation, data, entity, prop, value) => {
    this._sendChangeEvent({
      data,
      entity,
      prop,
      value,
      operation
    });
  });

  _sendChangeEvent = _debounce(props => {
    this.props.onChange(props);
  }, 1500);

  _makeCreateHandler = (entity, parent) => () => {};

  render() {
    const { data } = this.props;

    const movements = getMovements(data);
    const title = getTitle(data);
    const composer = getComposer(data);

    return (
      <div>
        <Title level={4}>Composition</Title>

        <Input
          placeholder={"Composition Title"}
          value={title}
          onChange={this._makeChangeHandler(
            EDITOR_ENTITY_COMPOSITION,
            data,
            "title"
          )}
        />
        <Input
          placeholder={"Composer's name"}
          value={composer}
          onChange={this._makeChangeHandler(
            EDITOR_ENTITY_COMPOSITION,
            data,
            "composer"
          )}
        />

        <Title level={4}>Movements</Title>

        <div>
          {movements.map(movement => {
            return (
              <MovementEditorForm
                data={movement}
                key={movement._id}
                onChange={this._makeChangeHandler}
              />
            );
          })}
          <AddMovementButton
            onClick={this._makeCreateHandler(EDITOR_ENTITY_MOVEMENT, data)}
          />
        </div>
      </div>
    );
  }
}

EditorForm.propTypes = {
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default EditorForm;
