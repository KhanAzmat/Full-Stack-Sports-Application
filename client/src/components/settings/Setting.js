import React from "react";
import { connect } from "react-redux";
import {  Redirect } from "react-router-dom";

// export const QosOption = createContext([]);
// const qosOption = [
//   {
//     label: "0",
//     value: 0,
//   },
//   {
//     label: "1",
//     value: 1,
//   },
//   {
//     label: "2",
//     value: 2,
//   },
// ];

const Setting = ({role}) => {
  if (role === "user") {
    return <Redirect to='/' />;
  }
  return (
    // <>
    //   <Connection
    //     connect={mqttConnect}
    //     disconnect={mqttDisconnect}
    //     connectBtn={connectStatus}
    //   />
    //   <QosOption.Provider value={qosOption}>
    //     <Subscriber sub={mqttSub} unSub={mqttUnSub} showUnsub={isSubed} />
    //     {/* <Publisher publish={mqttPublish} /> */}
    //   </QosOption.Provider>
    //   <Receiver payload={payload} />
    // </>
    <p>Setting</p>
  );
};
const mapStateToProps = (state) => ({
   role: state.auth.role
});

export default connect(mapStateToProps)(Setting);
