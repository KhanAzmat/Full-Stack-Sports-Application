

import { createAsyncThunk } from "@reduxjs/toolkit";
import { setAlerts } from "../../_actions/alertAction";
import axios from "axios";


export const addGltf = createAsyncThunk(
    "gltf/addGltf",
    async(formData,{dispatch,rejectWithValue})=>{
        console.log(formData);
        try {
          const res = await axios.post("/api/gltf", formData);
          /*dispatch({
            type: types.ADD_GLTF,
            payload: res.data,
          });*/
          dispatch(getGltfOfFloor(formData.get("floorplan")))
          dispatch(setAlerts("GLTF File Uploaded!", "success", true));
          //history.push("/navigation");
          return true
        } catch (err) {
          const errors = err.response && err.response.data.errors;
      
          console.log(err);
          if (errors) {
            errors.forEach((error) => dispatch(setAlerts(error.msg, "error", true)));
          }

          return rejectWithValue({status:err.response})
        }


    },

)

export const editGltfWithFile = createAsyncThunk(
    "gltf/editGltfFile",
    async(data,{dispatch,rejectWithValue})=>{
      console.log(data)
        const {formData, id } = data
        console.log(formData.get("floorplan"))
        try {
            const config = {
              headers: {
                "Content-Type": 'multipart/form-data',
              },
            };
        
            const res = await axios.patch(`/api/gltf/updategltf/${id}`, formData,config)
        
            /*dispatch({
              type: types.GET_GLTF,
              payload: res.data,
            });*/
            dispatch(getGltfOfFloor(formData.get("floorplan")))
           dispatch(setAlerts("Gltf information updated", "success", true));
           return true
          } catch (err) {
            const errors = err.response.data.errors;
        
            if (errors) {
              errors.forEach((error) => dispatch(setAlerts(error.msg, "error")));
            }

            return rejectWithValue({status : err.response})
          }
    }
)


export const editGltf = createAsyncThunk(
    "gltf/editGltf",
    async(data, {dispatch, rejectWithValue})=>{
      console.log(data)
        const {formData, id} = data
        console.log(formData.get("floorplan"))
        try {
           /* const config = {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            };
        */
         

            /** 
             *  formData.append("floorplan", configFloor.data.id);
    //formData.append("description", description);
    console.log(ambiIntensity)
    console.log(configFloor.data.id)
    formData.append("ambiIntensity",ambiIntensity);
    
    formData.append("dirIntensity",dirIntensity);
    formData.append("scale",gltfSettings["scale"])
    formData.append("angle",gltfSettings["angle"])
    formData.append("x",gltfSettings["x"])
    formData.append("y",gltfSettings["y"])
    formData.append("z",gltfSettings["z"])
            */
            const form = {
              floorplan:formData.get("floorplan") ,
              ambiIntensity:formData.get("ambiIntensity"),
              dirIntensity: formData.get("dirIntensity"),
              scale : formData.get("scale"),
              angle : formData.get("angle"),
              x: formData.get("x"),
              y:formData.get("y"),
              z:formData.get("z")
            }
            const res = await axios.patch(`/api/gltf/${id}`, form);
        
            /*dispatch({
              type: types.GET_GLTF,
              payload: res.data,
            });*/
            dispatch(getGltfOfFloor(formData.get("floorplan")))
            dispatch(setAlerts("Gltf information updated", "success", true));
            return true
          } catch (err) {
            const errors = err.response.data.errors;
        
            if (errors) {
              errors.forEach((error) => dispatch(setAlerts(error.msg, "error")));
            }
            return rejectWithValue({status : err.response})
          }

    }

)



export const deleteGltf = createAsyncThunk(
    "gltf/deleteGltf",
    async(id, {dispatch,rejectWithValue})=>{
        try {
            await axios.delete(`/api/gltf/${id}`);
            /*dispatch({
              type: types.DELETE_GLTF,
              payload: id,
            });*/
            dispatch(setAlerts("Gltf Deleted", "success", "true"));
            return true
          } catch (err) {
            /*dispatch({
              type: types.GLTF_ERROR,
            });**/
            dispatch(setAlerts("Internal Server Error", "error", "true"));
            return rejectWithValue({status : err.response})
          }


    }
)


export const getGltfOfFloor = createAsyncThunk(
    "gltf/ getGltfOfFloor",
    async(id,{dispatch,rejectWithValue})=>{
        try {
            const res = await axios.get(`/api/gltf/floorplan/${id}`);
        
            /*dispatch({
              type: types.SET_GLTF_OF_FLOORPLAN,
              payload: res.data.data,
            });*/

            return res.data.data
            


          } catch (err) {
            /*dispatch({
              type: types.GLTF_ERROR,
              payload: { status: err.response },
            });*/
            dispatch(setAlerts("Internal Server Error !! Cant Acess gltf", "error", "true"));
            return rejectWithValue({status:err.response})

          }

    }

)



export const getGltfOfDisplayFloor = createAsyncThunk(
  "gltf/getGltfOfDisplayFloor",
  async(id,{dispatch,rejectWithValue})=>{
      try {
          const res = await axios.get(`/api/gltf/floorplan/${id}`);
      
          /*dispatch({
            type: types.SET_GLTF_OF_FLOORPLAN,
            payload: res.data.data,
          });*/

          return res.data.data
          


        } catch (err) {
          /*dispatch({
            type: types.GLTF_ERROR,
            payload: { status: err.response },
          });*/
          dispatch(setAlerts("Internal Server Error !! Cant Acess gltf", "error", "true"));
          return rejectWithValue({status:err.response})

        }

  }

)