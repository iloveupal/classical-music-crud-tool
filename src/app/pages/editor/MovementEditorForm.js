import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { Typography, Select } from "antd";

import Input from "./helpers/InputSlow";
import FormInput from "./helpers/FormInput";

import { AVAILABLE_KEYS } from "framework/constants/keys";

import { getTitle, getKey, getRecordings } from "domains/movement/propGetters";
import { renderKey } from "domains/movement/utils";

import {
  EDITOR_ENTITY_MOVEMENT,
  EDITOR_ENTITY_RECORDING
} from "./EditorConstants";

import RecordingEditorForm from "app/pages/editor/RecordingEditorForm";
import AddRecordingButton from "app/pages/editor/buttons/AddRecordingButton";

import "./styles/movements-form.less";

const { Title } = Typography;
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
          <span
            className={"delete-link"}
            onClick={onDelete(EDITOR_ENTITY_MOVEMENT, data)}
          >
            Delete
          </span>
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

            <AddRecordingButton
              onClick={onCreate(EDITOR_ENTITY_RECORDING, data)}
            />
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
