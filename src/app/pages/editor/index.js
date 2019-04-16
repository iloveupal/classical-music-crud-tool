import _get from "lodash/get";

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
  EDITOR_STATUS_SYNCED,
  EDITOR_ENTITY_COMPOSITION,
  EDITOR_ENTITY_MOVEMENT,
  EDITOR_ENTITY_RECORDING
} from "./EditorConstants";

import { createViewLink } from "app/utils/router";

import Loading from "app/ui/loading";
import EditorErrorsList from "./EditorErrorsList";
import EditorForm from "./EditorForm";

import "./styles/style.less";

export class EditorPage extends PureComponent {
  state = {
    status: EDITOR_STATUS_NEW,
    composition: null,
    errors: null
  };

  componentDidMount() {
    const { id, onGetComposition, onCreateComposition } = this.props;

    this.setState({
      status: EDITOR_STATUS_LOADING
    });

    const operation = id
      ? onGetComposition({ id }).then(({ result, errors, success }) => {
          if (!success) {
            this._setErrors(errors);
          } else {
            this._setResult(result);
          }
        })
      : onCreateComposition({}).then(({ result, errors, success }) => {
          if (!success) {
            this._setErrors(errors);
          } else {
            this._setResult({
              _id: result,
              title: "",
              composer: ""
            });
          }
        });
  }

  _setErrors = errors => {
    this.setState({
      errors,
      status: EDITOR_STATUS_LOADED
    });
  };

  _setResult = composition => {
    this.setState({
      composition,
      status: EDITOR_STATUS_LOADED
    });
  };

  _handleChange = ({ data, entity, prop, value }) => {
    const updateFn = _get(
      {
        [EDITOR_ENTITY_COMPOSITION]: this.props.onUpdateComposition,
        [EDITOR_ENTITY_MOVEMENT]: this.props.onUpdateMovement,
        [EDITOR_ENTITY_RECORDING]: this.props.onUpdateRecording
      },
      entity
    );

    const id = data._id;

    const updateObj = { [prop]: value };

    this.setState({
      state: EDITOR_STATUS_UPDATING
    });

    updateFn({ id, ...updateObj }).then(({ result, success, errors }) => {
      if (success) {
        this._finishUpdating({
          entity,
          updateObj,
          id
        });
      } else {
        this._setErrors(errors);
      }
    });
  };

  _handleDelete = (entity, data) => () => {
    const deleteFn = _get(
      {
        [EDITOR_ENTITY_MOVEMENT]: this.props.onDeleteMovement,
        [EDITOR_ENTITY_RECORDING]: this.props.onDeleteRecording
      },
      entity
    );

    const id = data._id;

    this.setState({
      state: EDITOR_STATUS_UPDATING
    });

    deleteFn({ id }).then(({ result, success, errors }) => {
      if (success) {
        this._finishDeleting({
          entity,
          id
        });
      } else {
        this._setErrors(errors);
      }
    });
  };

  _handleCreate = (entity, parent) => () => {
    const createFn = _get(
      {
        [EDITOR_ENTITY_MOVEMENT]: this.props.onCreateMovement,
        [EDITOR_ENTITY_RECORDING]: this.props.onCreateRecording
      },
      entity
    );

    this.setState({
      state: EDITOR_STATUS_UPDATING
    });

    createFn({ parent: parent._id }).then(({ result, success, errors }) => {
      if (success) {
        this._finishCreating({
          entity,
          id: result,
          parent: parent._id
        });
      } else {
        this._setErrors(errors);
      }
    });
  };

  _finishCreating = ({ entity, id, parent }) => {
    if (entity === EDITOR_ENTITY_MOVEMENT) {
      this.setState(prevState => ({
        composition: {
          ...prevState.composition,
          movements: (prevState.composition.movements || []).concat([
            {
              _id: id,
              parent
            }
          ])
        },
        status: EDITOR_STATUS_SYNCED
      }));
    }

    if (entity === EDITOR_ENTITY_RECORDING) {
      this.setState(prevState => ({
        composition: {
          ...prevState.composition,
          movements: prevState.composition.movements.map(movement => {
            if (movement._id !== parent) {
              return movement;
            }

            return {
              ...movement,
              recordings: (movement.recordings || []).concat([
                {
                  _id: id,
                  parent
                }
              ])
            };
          })
        },
        status: EDITOR_STATUS_SYNCED
      }));
    }
  };

  _finishDeleting = ({ entity, id }) => {
    if (entity === EDITOR_ENTITY_MOVEMENT) {
      this.setState(prevState => ({
        composition: {
          ...prevState.composition,
          movements: prevState.composition.movements.filter(
            ({ _id }) => _id !== id
          )
        },
        status: EDITOR_STATUS_SYNCED
      }));
    }

    if (entity === EDITOR_ENTITY_RECORDING) {
      this.setState(prevState => ({
        composition: {
          ...prevState.composition,
          movements: prevState.composition.movements.map(movement => {
            return {
              ...movement,
              recordings: movement.recordings.filter(({ _id }) => _id !== id)
            };
          })
        },
        status: EDITOR_STATUS_SYNCED
      }));
    }
  };

  _finishUpdating = ({ entity, updateObj, id }) => {
    if (entity === EDITOR_ENTITY_COMPOSITION) {
      this.setState(prevState => ({
        composition: {
          ...prevState.composition,
          ...updateObj
        },
        status: EDITOR_STATUS_SYNCED
      }));
    }

    if (entity === EDITOR_ENTITY_MOVEMENT) {
      this.setState(prevState => ({
        composition: {
          ...prevState.composition,
          movements: prevState.composition.movements.map(movement => {
            if (movement._id !== id) {
              return movement;
            }

            return {
              ...movement,
              ...updateObj
            };
          })
        },
        status: EDITOR_STATUS_SYNCED
      }));
    }

    if (entity === EDITOR_ENTITY_RECORDING) {
      this.setState(prevState => ({
        composition: {
          ...prevState.composition,
          movements: prevState.composition.movements.map(movement => {
            return {
              ...movement,
              recordings: movement.recordings.map(recording => {
                if (recording._id !== id) {
                  return recording;
                }

                return {
                  ...recording,
                  ...updateObj
                };
              })
            };
          })
        },
        status: EDITOR_STATUS_SYNCED
      }));
    }
  };

  render() {
    const { errors, composition, status } = this.state;

    return (
      <div className={"pages-editor-container"}>
        {(status === EDITOR_STATUS_LOADED ||
          status === EDITOR_STATUS_UPDATING ||
          status === EDITOR_STATUS_SYNCED) && (
          <Fragment>
            <EditorErrorsList errors={errors} />
            <EditorForm
              data={composition}
              onChange={this._handleChange}
              onDelete={this._handleDelete}
              onCreate={this._handleCreate}
            />
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
  onCreateRecording: createRecording,
  onUpdateRecording: updateRecording,
  onDeleteRecording: deleteRecording,
  onFinish: () => props.history.replace(createViewLink(), {})
}))(EditorPage);
