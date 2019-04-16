import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import { withProps } from "recompose";

import {
  createComposition,
  getComposition,
  updateComposition
} from "app/api/compositions";

import {
  createMovement,
  deleteMovement,
  updateMovement
} from "app/api/movements";

import {
  createRecording,
  deleteRecording,
  updateRecording,
  uploadRecording
} from "app/api/recordings";

import {
  EDITOR_STATUS_LOADING,
  EDITOR_STATUS_LOADED,
  EDITOR_STATUS_NEW,
  EDITOR_STATUS_UPDATING,
  EDITOR_STATUS_SYNCED
} from "./EditorConstants";

import { createViewLink } from "app/utils/router";

import Loading from "app/ui/loading";
import EditorErrorsList from "./EditorErrorsList";
import EditorForm from "./EditorForm";

export class EditorPage extends PureComponent {
  state = {
    status: EDITOR_STATUS_NEW,
    composition: null,
    errors: null
  };

  componentDidMount() {
    const { id, onGetComposition, onCreateComposition } = this.props;

    const operation = id
      ? onGetComposition({ id }).then(({ result, errors, success }) => {
          if (!success) {
            this._setCannotLoad(errors);
          } else {
            this._setResult(result);
          }
        })
      : onCreateComposition({}).then(({ result, errors, success }) => {
          if (!success) {
            this._setCannotLoad(errors);
          } else {
            this._setResult({
              _id: result,
              title: "",
              composer: ""
            });
          }
        });
  }

  _setCannotLoad = errors => {
    this.setState({
      errors
    });
  };

  _setResult = composition => {
    this.setState({
      composition
    });
  };

  _handleChange = (operation, params) => {};

  render() {
    const { errors, composition, status } = this.state;

    return (
      <div className={"pages-editor-container"}>
        {(status === EDITOR_STATUS_LOADED ||
          status === EDITOR_STATUS_UPDATING ||
          status === EDITOR_STATUS_SYNCED) && (
          <Fragment>
            <EditorErrorsList errors={errors} />
            <EditorForm data={composition} onChange={this._handleChange} />
          </Fragment>
        )}
        {status === EDITOR_STATUS_LOADING && <Loading />}
      </div>
    );
  }
}

EditorPage.propTypes = {
  id: PropTypes.string,

  onGetComposition: PropTypes.func.isRequired,
  onUpdateComposition: PropTypes.func.isRequired,
  onCreateComposition: PropTypes.func.isRequired,
  onCreateMovement: PropTypes.func.isRequired,
  onUpdateMovement: PropTypes.func.isRequired,
  onDeleteMovement: PropTypes.func.isRequired,
  onUploadRecording: PropTypes.func.isRequired,
  onCreateRecording: PropTypes.func.isRequired,
  onUpdateRecording: PropTypes.func.isRequired,
  onDeleteRecording: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired
};

export default withProps(props => ({
  id: props.match.params.id,

  onGetComposition: getComposition,
  onUpdateComposition: updateComposition,
  onCreateComposition: createComposition,
  onCreateMovement: createMovement,
  onUpdateMovement: updateMovement,
  onDeleteMovement: deleteMovement,
  onUploadRecording: uploadRecording,
  onCreateRecording: createRecording,
  onUpdateRecording: updateRecording,
  onDeleteRecording: deleteRecording,
  onFinish: () => props.history.replace(createViewLink(), {})
}))(EditorPage);
