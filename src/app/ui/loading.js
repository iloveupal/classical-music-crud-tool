import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import "./styles/loading.less";
import spinner from "./images/spinner.svg";

class Loading extends PureComponent {
  render() {
    return (
      <div className={"ui-loading"}>
        <img className={"ui-loading-img"} src={spinner} alt={"loading..."} />
      </div>
    );
  }
}

Loading.propTypes = {};

export default Loading;
