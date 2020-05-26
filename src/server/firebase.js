import app from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/firebase-storage";
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
        this.storage = app.storage();
        this.authorization =app.auth;
        this.storage.ref().constructor.prototype.guardarDocumentos = function (documentos) {
            var ref = this;
            return Promise.all(documentos.map(function (file) {
                return ref.child(file.alias).put(file).then(snapshot => {
                    return ref.child(file.alias).getDownloadURL();
                })
            }))
        }
    }
    estaIniciado() {
        return new Promise(resolve => {
            this.auth.onAuthStateChanged(resolve);
        })
    }
    guardarDocumento = (nombreDocumento, documento) => this.storage.ref().child(nombreDocumento).put(documento);

    devolverDocumento = (documentoUrl) => this.storage.ref().child(documentoUrl).getDownloadURL();

    guardarDocumentos = (documentos) => this.storage.ref().guardarDocumentos(documentos);

    eliminarDocumento= documento=> this.storage.ref().child(documento).delete();
    
}
export default Firebase;