import React, { PureComponent } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

import { Card } from "antd";
import {
  getComposer,
  getMovements,
  getTitle
} from "domains/composition/propGetters";

import MovementListItem from "./MovementListItem";

import "./styles/list-item.less";

function renderTitle({ title, composer }) {
  return (
    <div className={"composition-list-item__card-title"}>
      <span
        className={classnames({
          "composition-list-item__title": !!title,
          "composition-list-item__title-empty": !title
        })}
      >
        {title || "No title"}
      </span>
      <span className={"composition-list-item__composer"}>{composer}</span>
    </div>
  );
}

function renderExtra({ onDelete, onEdit, id }) {
  return (
    <div>
      <span
        onClick={() => onEdit(id)}
        className={"composition-list-item__edit-link"}
      >
        Edit
      </span>
      <span
        onClick={() => onDelete(id)}
        className={"composition-list-item__delete-link"}
      >
        Delete
      </span>
    </div>
  );
}

class CompositionListItem extends PureComponent {
  render() {
    const { onDelete, onEdit } = this.props;
    const composition = this.props.data;

    const title = getTitle(composition);
    const composer = getComposer(composition);
    const movements = getMovements(composition);

    return (
      <Card
        title={renderTitle({ title, composer })}
        extra={renderExtra({ onDelete, onEdit, id: composition._id })}
        className={"composition-list-item"}
      >
        {(movements.length &&
          movements.map(movement => {
            return <MovementListItem key={movement._id} data={movement} />;
          })) ||
          null}
        {(!movements.length && (
          <span className={"composition-list-item__no-movements"}>
            No movements found
          </span>
        )) ||
          null}
      </Card>
    );
  }
}

CompositionListItem.propTypes = {
  data: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
};

export default CompositionListItem;
