import { combineReducers } from "redux";
import { CoordinateAxesReducer as coordinateAxes } from "./coordinate_axes/reducer/coordinate_axes_reducer";
import { ToolbarReducer as toolbar } from "./toolbar/reducer/toolbar_reducer";

export default combineReducers({
    coordinateAxes,
    toolbar
});