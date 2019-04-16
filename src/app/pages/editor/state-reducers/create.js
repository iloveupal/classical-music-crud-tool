import {
  EDITOR_ENTITY_MOVEMENT,
  EDITOR_ENTITY_RECORDING,
  EDITOR_STATUS_SYNCED
} from "app/pages/editor/EditorConstants";

export default ({ entity, id, parent }) => {
  if (entity === EDITOR_ENTITY_MOVEMENT) {
    return prevState => ({
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
    });
  }

  if (entity === EDITOR_ENTITY_RECORDING) {
    return prevState => ({
      composition: {
        ...prevState.composition,
        movements: (prevState.composition.movements || []).map(movement => {
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
    });
  }
};
