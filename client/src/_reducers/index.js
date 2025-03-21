import { combineReducers } from "redux";
import auth from "./authReducer";
import alert from "./alertReducer";
import tag from "./tagReducer";
import employee from "./employeeReducer";
import asset from "./assetReducer";
import anchor from "./anchorReducer";
import building from "./buildingReducer";
import floorplan from "./floorplanReducer";
import organisation from "./organisationReducer";
import item from "./itemReducer";
import linkedTag from "./linkedTagReducer";
import tagPos from "./tagPosReducer";
import geofence from "./geofenceReducer";
import count from "./countReducer";
import gltf from "./gltfReducer";
import apiKey from "./apiKeyReducer";
import color from "./colorReducer"
//import anchor from "./anchorReducer"

export default combineReducers({
  auth,
  alert,
  tag,
  employee,
  anchor,
  building,
  floorplan,
  asset,
  item,
  organisation,
  linkedTag,
  tagPos,
  geofence,
  count,
  gltf,
  apiKey,
  color
});
