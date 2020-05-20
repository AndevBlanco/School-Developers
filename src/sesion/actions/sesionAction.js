export const iniciarSesion = (dispatch, Firebase, correo, contraseña) => {
    return new Promise((resolve, eject) => {
        Firebase.auth
            .signInWithEmailAndPassword(correo, contraseña)
            .then(auth => {
                Firebase.db
                    .collection("Usuarios")
                    .doc(auth.user.uid)
                    .get()
                    .then(doc => {
                        const usuarioDB = doc.data();
                        dispatch({
                            type: "INICIAR_SESION",
                            sesion: usuarioDB,
                            autenticado: true
                        });
                        resolve({ status: true });
                    });
            }).catch(error => {
                console.log(error);
                resolve({ status: false, mensaje: error });
            });
    });
};
export const crearUsuario = (dispatch, Firebase, usuario) => {
    return new Promise((resolve, eject) => {
        Firebase.auth
            .createUserWithEmailAndPassword(usuario.correo, usuario.contraseña)
            .then(auth => {
                Firebase.db
                    .collection("Usuarios")
                    .doc(auth.user.uid)
                    .set({
                        id: auth.user.uid,
                        nombre: usuario.nombre,
                        apellido: usuario.apellido,
                        correo: usuario.correo,
                        tipo: usuario.tipo
                    }, { merge: true }
                    )
                    .then(doc => {
                        usuario.id = auth.user.uid
                        dispatch({
                            type: "INICIAR_SESION",
                            sesion: usuario,
                            autenticado: true
                        });
                        resolve({status:true});
                    });
            }).catch(error => {
                console.log(error)
                resolve({status:false,mensaje:error})
            });
    });
};
export const cerrarSesion = (dispatch, Firebase) => {
    return new Promise((resolve, eject) => {
        Firebase.auth.signOut().then(salir => {
            dispatch({
                type: "CERRAR_SESION",
                nuevoUsuario: {
                    nombre: "",
                    apellido: "",
                    correo: "",
                    foto: "",
                    id: "",
                    telefono: "",
                },
                autenticado: false
            })
            resolve();
        })
    })
}