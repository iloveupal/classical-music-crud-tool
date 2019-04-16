import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { NavLink } from "react-router-dom";

import "./styles/link.less";

class Link extends PureComponent {
  render() {
    return (
      <NavLink
        className={"ui-link"}
        activeClassName={"ui-link-active"}
        {...this.props}
      />
    );
  }
}

export class ColorLink extends PureComponent {
  static allowedTypes = ["primary", "danger"];

  static propTypes = {
    type: PropTypes.oneOf(ColorLink.allowedTypes),
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string
  };

  render() {
    return (
      <span
        onClick={this.props.onClick}
        className={classNames([
          "ui-color-link",
          `ui-color-link__${this.props.type}`,
          this.props.className
        ])}
      >
        {this.props.children}
      </span>
    );
  }
}

export default Link;
