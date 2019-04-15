import React, { PureComponent } from "react";

import loadable from "@loadable/component";

import Loading from "app/ui/loading";

const AsyncPage = loadable(props => import(`app/pages/${props.page}`), {
  fallback: <Loading />
});

export default AsyncPage;
