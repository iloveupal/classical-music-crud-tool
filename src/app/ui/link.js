import React, { PureComponent } from "react";

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

export default Link;
