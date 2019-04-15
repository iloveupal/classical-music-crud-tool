import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import "./styles/main-container.less";

class MainContainer extends PureComponent {
  render() {
    return <div className={"ui-main-container"}>{this.props.children}</div>;
  }
}

MainContainer.propTypes = {
  children: PropTypes.node
};

export default MainContainer;
