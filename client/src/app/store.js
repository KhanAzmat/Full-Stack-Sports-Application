import {configureStore} from '@reduxjs/toolkit'

import layerReducer from '../feature/layerSlice'
import alertReducer from "../feature/alert/alertSlice"
import apiKeyReducer from '../feature/apiKey/apiKeySlice'
import assetReducer from '../feature/asset/assetSlice'
import authReducer from '../feature/auth/authSlice'
import colorReducer from '../feature/color/colorSlice'
import floorplanReducer from '../feature/floorplan/floorplanSlice'
import geofenceReducer from '../feature/geofence/geofenceSlice'
import gltfReducer from '../feature/gltf/gltfSlice'
import linkedTagReducer from '../feature/linkedTag/linkedTagSlice'
import tagReducer from '../feature/tag/tagSlice'
import anchorReducer from '../feature/anchor/anchorSlice'
import udpReducer from "../feature/udp/udpSlice"
import mqttReducer from "../feature/mqtt/mqttSlice"
import dimReducer from '../feature/dimensions/dimSlice'
import trackerReducer from '../feature/tracker/trackerSlice'
import serverReducer from '../feature/server/serverSlice'
import playerReducer from '../feature/player/playerSlice'
import linkedTagPlayerReducer from '../feature/linkedTagPlayer/linkedTagPlayerSlice'
import teamReducer from '../feature/team/teamSlice'
import linkedTeamPlayerReducer from '../feature/linkedTeamPlayer/linkedTeamPlayerSlice'

export default configureStore ({

    reducer : {

        alert : alertReducer,
        apiKey : apiKeyReducer,
        asset: assetReducer,
        auth : authReducer,
        color: colorReducer,
        floorplan : floorplanReducer,
        geofence : geofenceReducer,
        gltf : gltfReducer,
        linkedTag:linkedTagReducer,
        tag : tagReducer,
        anchor : anchorReducer,
        udp:udpReducer,
        mqtt:mqttReducer,
        layer:layerReducer,
        dimension : dimReducer,
        tracker : trackerReducer,
        server : serverReducer,
        player : playerReducer,
        linkedTagPlayer : linkedTagPlayerReducer,
        team : teamReducer,
        linkedTeamPlayer : linkedTeamPlayerReducer,
    }
})