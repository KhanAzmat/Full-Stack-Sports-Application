import { v4 as uuidv4 } from "uuid";
import { removeAlert, setAlert } from "../feature/alert/alertSlice";


export  const setAlerts = (msg, alertType, open, timeout = 5000) => (
  dispatch
) => {
  const id = uuidv4();
  dispatch(
    setAlert ({ msg, alertType, open, id })
  );

  setTimeout(() => dispatch( removeAlert(id) ),timeout);
};
