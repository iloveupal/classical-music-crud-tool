import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { getPerformers, getYear } from "domains/recording/propGetters";

import { EDITOR_ENTITY_RECORDING } from "app/pages/editor/EditorConstants";

import {
  RECORDING_MAXIMAL_YEAR,
  RECORDING_MINIMAL_YEAR
} from "domains/recording/constants";

import FormInput from "./helpers/FormInput";
import InputSlow from "./helpers/InputSlow";
import ArrayInput from "./helpers/ArrayInput";
import UploadRecordingButton from "app/pages/editor/buttons/UploadRecordingButton";

import "./styles/recordings-form.less";

class RecordingEditorForm extends PureComponent {
  _handleRecordingUploaded = metadata => {
    if (metadata.year) {
      this.props.onChange(
        EDITOR_ENTITY_RECORDING,
        this.props.data,
        "year",
        metadata.year
      );
    }

    if (metadata.artists && metadata.artists.length) {
      this.props.onChange(
        EDITOR_ENTITY_RECORDING,
        this.props.data,
        "performers",
        metadata.artists.map(artistName => ({
          name: artistName,
          type: ""
        }))
      );
    }
  };

  render() {
    const { data, onChange, onDelete, index } = this.props;

    const year = getYear(data);
    const performers = getPerformers(data);

    return (
      <div>
        <div className={"recordings-editor-form__header"}>
          {`${index + 1}.`}
          <span
            className={"delete-link"}
            onClick={onDelete(EDITOR_ENTITY_RECORDING, data)}
          >
            Delete
          </span>
        </div>
        <UploadRecordingButton
          recordingId={data._id}
          onUpload={this._handleRecordingUploaded}
        />
        <FormInput name={"Year"}>
          <div>
            <InputSlow
              numeric
              value={year}
              min={RECORDING_MINIMAL_YEAR}
              max={RECORDING_MAXIMAL_YEAR}
              onChange={onChange(EDITOR_ENTITY_RECORDING, data, "year")}
            />
          </div>
        </FormInput>
        <FormInput name={"Performers"}>
          <div className={"recordings-editor-form__performers"}>
            <ArrayInput
              value={performers}
              addButtonLabel={"Add a Performer"}
              fields={["name", "type"]}
              onChange={onChange(EDITOR_ENTITY_RECORDING, data, "performers")}
            />
          </div>
        </FormInput>
      </div>
    );
  }
}

RecordingEditorForm.propTypes = {
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
};

export default RecordingEditorForm;
