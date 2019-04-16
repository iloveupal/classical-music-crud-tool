import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { Select } from "antd";

import { AVAILABLE_KEYS } from "framework/constants/keys";

import {
  EDITOR_ENTITY_MOVEMENT,
  EDITOR_ENTITY_RECORDING
} from "app/pages/editor/EditorConstants";

import { getTitle, getKey, getRecordings } from "domains/movement/propGetters";
import { renderKey } from "domains/movement/utils";

import { ColorLink } from "app/ui/link";
import FormInput from "app/pages/editor/helpers/FormInput";
import Input from "app/pages/editor/helpers/InputSlow";

import RecordingEditorForm from "app/pages/editor/forms/RecordingEditorForm";
import AddRecordingButton from "app/pages/editor/buttons/AddRecordingButton";

import "app/pages/editor/styles/movements-form.less";

const { Option } = Select;

class MovementEditorForm extends PureComponent {
  render() {
    const { index, data, onChange, onDelete, onCreate } = this.props;

    const title = getTitle(data);
    const key = getKey(data);
    const recordings = getRecordings(data);

    return (
      <div className={"editor-page-movements-form"}>
        <div className={"editor-page-movements-form__header"}>
          {`${index + 1}.`}
          <ColorLink
            type={"danger"}
            onClick={onDelete(EDITOR_ENTITY_MOVEMENT, data)}
          >
            Delete
          </ColorLink>
        </div>
        <FormInput name={"Title"}>
          <Input
            placeholder={"Movement title"}
            value={title}
            onChange={onChange(EDITOR_ENTITY_MOVEMENT, data, "title")}
          />
        </FormInput>
        <FormInput name={"Harmonic Key"}>
          <div>
            <Select
              className={"editor-page-movements-form__key"}
              value={key}
              onChange={onChange(EDITOR_ENTITY_MOVEMENT, data, "key")}
            >
              {AVAILABLE_KEYS.map(key => {
                return (
                  <Option value={key} key={key}>
                    {renderKey(key)}
                  </Option>
                );
              })}
            </Select>
          </div>
        </FormInput>

        <FormInput name={"Recordings"}>
          <div className={"editor-page-movements-form__recordings"}>
            {recordings.map((recording, index) => {
              return (
                <RecordingEditorForm
                  data={recording}
                  key={recording._id}
                  index={index}
                  onChange={onChange}
                  onDelete={onDelete}
                />
              );
            })}

            <div className={"editor-page-movements-form__add-recording"}>
              <AddRecordingButton
                onClick={onCreate(EDITOR_ENTITY_RECORDING, data)}
              />
            </div>
          </div>
        </FormInput>
      </div>
    );
  }
}

MovementEditorForm.propTypes = {
  data: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
};

export default MovementEditorForm;
