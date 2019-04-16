import {
  EDITOR_ENTITY_MOVEMENT,
  EDITOR_ENTITY_RECORDING,
  EDITOR_STATUS_SYNCED
} from "app/pages/editor/EditorConstants";

export default ({ entity, id }) => {
  if (entity === EDITOR_ENTITY_MOVEMENT) {
    return prevState => ({
      composition: {
        ...prevState.composition,
        movements: (prevState.composition.movements || []).filter(
          ({ _id }) => _id !== id
        )
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
            recordings: (movement.recordings || []).filter(
              ({ _id }) => _id !== id
            )
          };
        })
      },
      status: EDITOR_STATUS_SYNCED
    });
  }
};
