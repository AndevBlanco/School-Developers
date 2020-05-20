import React from "react";
const FirebaseContext=React.createContext();


export default FirebaseContext;
export const consumerFirebase=Component =>props=>(
    <FirebaseContext.Consumer>
        {Firebase =><Component {...props} Firebase={Firebase}/>}
    </FirebaseContext.Consumer>
)
