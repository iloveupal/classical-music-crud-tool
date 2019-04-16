import _curry from "lodash/curry";

import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { Typography } from "antd";

import Input from "./helpers/InputSlow";
import FormInput from "./helpers/FormInput";

import {
  getComposer,
  getMovements,
  getTitle
} from "domains/composition/propGetters";

import {
  EDITOR_ENTITY_COMPOSITION,
  EDITOR_ENTITY_MOVEMENT
} from "app/pages/editor/EditorConstants";

import MovementEditorForm from "./MovementEditorForm";
import AddMovementButton from "./buttons/AddMovementButton";

import "./styles/editor-form.less";

const { Title } = Typography;

class EditorForm extends PureComponent {
  _makeChangeHandler = _curry((entity, data, prop, value) => {
    this.props.onChange({
      data,
      entity,
      prop,
      value
    });
  });

  render() {
    const { data, onCreate, onDelete } = this.props;

    const movements = getMovements(data);
    const title = getTitle(data);
    const composer = getComposer(data);

    return (
      <div className={"editor-page-form"}>
        <Title level={4}>Composition</Title>

        <FormInput name={"Title"}>
          <Input
            placeholder={"Composition Title"}
            value={title}
            onChange={this._makeChangeHandler(
              EDITOR_ENTITY_COMPOSITION,
              data,
              "title"
            )}
          />
        </FormInput>
        <FormInput name={"Composer's Name"}>
          <Input
            placeholder={"Composer's name"}
            value={composer}
            onChange={this._makeChangeHandler(
              EDITOR_ENTITY_COMPOSITION,
              data,
              "composer"
            )}
          />
        </FormInput>

        <FormInput name={"Movements"}>
          <div className={"editor-page-form__movements"}>
            {movements.map((movement, index) => {
              return (
                <MovementEditorForm
                  index={index}
                  data={movement}
                  key={movement._id}
                  onChange={this._makeChangeHandler}
                  onDelete={onDelete}
                  onCreate={onCreate}
                />
              );
            })}
            <AddMovementButton
              onClick={onCreate(EDITOR_ENTITY_MOVEMENT, data)}
            />
          </div>
        </FormInput>
      </div>
    );
  }
}

EditorForm.propTypes = {
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
};

export default EditorForm;
