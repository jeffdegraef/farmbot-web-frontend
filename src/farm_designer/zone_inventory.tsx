import * as React from "react";
import { Link } from "react-router";

export class Zones extends React.Component<any, any> {
  render() {
    return (
      <div className="panel-container brown-panel">
        <div className="panel-header brown-panel">
          <div className="panel-tabs">
            <ul>
              <li className="hidden-sm hidden-md hidden-lg">
                <Link to={"/app/designer?p1=NoTab"}>Designer</Link>
              </li>
              <li>
                <Link to={"/app/designer?p1=Plants"}>Plants</Link>
              </li>
              <li>
                <Link to={"/app/designer?p1=Groups"}>Groups</Link>
              </li>
              <li>
                <Link to={"/app/designer?p1=Zones"}
                  className="active">Zones</Link>
              </li>
              <li className="hidden-sm hidden-md hidden-lg">
                <Link to={"/app/designer?p1=Panel2"}>Calendar</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="panel-content">
          <p>Note: Zones are coming soon!</p>
          <i className="fa fa-search"></i>
          <input className="search" placeholder="Search" />
          <div className="search-underline"></div>
          <div className="object-list">
            <label>My Zones</label>
            <ul>
              <li>
                <a href="#">Front area</a>
                <p>18 Square Feet</p>
              </li>
              <li>
                <a href="#">Needs Compost</a>
                <p>5 Square Feet</p>
              </li>
            </ul>
          </div>
          <div className="object-list">
            <label>Auto-Zones</label>
            <ul>
              <li>
                <a href="#">Broccoli Overlord</a>
                <p>60 Square Feet</p>
              </li>
            </ul>
          </div>
        </div>
        <Link to="app/designer?p1=AddZone">
          <div className="plus-button add-zone button-like"
            data-toggle="tooltip" title="Add zone">
            <i className="fa fa-2x fa-plus" />
          </div>
        </Link>
      </div>
    );
  }
};
