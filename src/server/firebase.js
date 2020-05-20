import app from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyCSRCP1qcQUIxzRAveUYYf_W6pYKvSVbeU",
    authDomain: "schooldevelopers-65b4e.firebaseapp.com",
    databaseURL: "https://schooldevelopers-65b4e.firebaseio.com",
    projectId: "schooldevelopers-65b4e",
    storageBucket: "schooldevelopers-65b4e.appspot.com",
    messagingSenderId: "601794739879",
    appId: "1:601794739879:web:ad47fcff6a4064bad72582",
    measurementId: "G-0VB60TKSMR"
};
class Firebase {
    constructor() {
        app.initializeApp(firebaseConfig);
        this.db = app.firestore();
        this.auth = app.auth();
    }
    estaIniciado(){
        return new Promise(resolve=>{
            this.auth.onAuthStateChanged(resolve);
        })
    }

}
export default Firebase;