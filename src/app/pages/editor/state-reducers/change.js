import {
  EDITOR_ENTITY_COMPOSITION,
  EDITOR_ENTITY_MOVEMENT,
  EDITOR_ENTITY_RECORDING,
  EDITOR_STATUS_SYNCED
} from "app/pages/editor/EditorConstants";

export default function changeReducer({ entity, updateObj, id }) {
  if (entity === EDITOR_ENTITY_COMPOSITION) {
    return prevState => ({
      composition: {
        ...prevState.composition,
        ...updateObj
      },
      status: EDITOR_STATUS_SYNCED
    });
  }

  if (entity === EDITOR_ENTITY_MOVEMENT) {
    return prevState => ({
      composition: {
        ...prevState.composition,
        movements: (prevState.composition.movements || []).map(movement => {
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
    });
  }

  if (entity === EDITOR_ENTITY_RECORDING) {
    return prevState => ({
      composition: {
        ...prevState.composition,
        movements: (prevState.composition.movements || []).map(movement => {
          return {
            ...movement,
            recordings: (movement.recordings || []).map(recording => {
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
    });
  }
}
