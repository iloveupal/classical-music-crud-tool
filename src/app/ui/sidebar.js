import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import "./styles/sidebar.less";

class Sidebar extends PureComponent {
  render() {
    return <div className={"ui-sidebar"}>{this.props.children}</div>;
  }
}

Sidebar.propTypes = {
  children: PropTypes.node
};

export default Sidebar;
