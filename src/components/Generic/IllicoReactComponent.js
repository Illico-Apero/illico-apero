import React from "react";
import VisitorService from "../../network/services/VisitorService";

export default class IllicoReactComponent extends React.Component {

  constructor(props) {
    super(props);
    this.visitorService = new VisitorService();
    const location = props.location.pathname;
    let componentName = (location === '/') ? 'Landing' : location.slice(1);
    this.visitorService.logVisit(props.location.pathname);
  }
}