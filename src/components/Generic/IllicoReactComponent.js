import React from "react";
import VisitorService from "../../network/services/VisitorService";

export default class IllicoReactComponent extends React.Component {


  constructor(props) {
    super(props);
    this.visitorService = new VisitorService();
    this.UNDEFINED_URL = 'UNDEFINED_URL';
    if(props.location) {
      const location = props.location.pathname;
      let componentName = (location === '/') ? 'Landing' : location.slice(1);
      this.visitorService.logVisit(componentName, () => {});
    }
    else if(props && props.hideTopAppBar) { }
    else {
      this.visitorService.logVisit(this.UNDEFINED_URL, () => {});
    }
  }
}