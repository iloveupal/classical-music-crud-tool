import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Route } from "react-router-dom";

import AsyncPage from "./utils/asyncPage";
import Sidebar from "./ui/sidebar";
import MainContainer from "./ui/main-container";
import Link from "./ui/link";

class App extends PureComponent {
  render() {
    return (
      <Router>
        <MainContainer>
          <Sidebar>
            <Link to={"/editor"}>Create</Link>
            <Link to={"/view"}>View</Link>
          </Sidebar>

          <Route path={"/view"} component={() => <AsyncPage page={"list"} />} />
          <Route
            path={"/editor"}
            component={() => <AsyncPage page={"editor"} />}
          />
        </MainContainer>
      </Router>
    );
  }
}

App.propTypes = {};

export default App;
