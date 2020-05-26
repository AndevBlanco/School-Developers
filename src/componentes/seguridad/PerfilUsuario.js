import React, { useState, useEffect } from "react";
import { useStateValue } from "../../sesion/store";
import { Container, Avatar, Typography, Grid, TextField, Button } from "@material-ui/core";
import reactFoto from "../../logo.svg";
import styleForm from "../estilos/estiloForm";
import { consumerFirebase } from "../../server";
import { openMensajePantalla } from "../../sesion/actions/snackbarAction";
import ImageUploader from "react-images-upload";
import { v4 as uuidv4 } from 'uuid';


const PerfilUsuario = props => {
    const [{ sesion }, dispatch] = useStateValue();
    const Firebase = props.Firebase;
    let [estado, cambiarEstado] = useState({             // creando estado para componente plano
        nombre: "",
        apellido: "",
        correo: "",
        tipo: "",
        telefono: "",
        id: "",
        foto: ""
    })
    const cambiarDato = e => {
        const { name, value } = e.target;
        cambiarEstado(prev => ({
            ...prev,
            [name]: value
        }))
    }
    const guradarCambios = e => {
        e.preventDefault();
        Firebase.db
            .collection("Usuarios")
            .doc(Firebase.auth.currentUser.uid)
            .set(estado, { merge: true })
            .then(success => {
                dispatch({
                    type: "INICIAR_SESION",
                    sesion: estado,
                    autenticado: true
                })
                openMensajePantalla(dispatch, {
                    open: true,
                    mensaje: "Se guradaron los cambios con exito"
                })
            })
            .catch(error => {
                openMensajePantalla(dispatch, {
                    open: true,
                    mensaje: "Error al guardar en la base de datos"
                })
            })
    }
    const validarEstadoFormulario=sesion=>{
        if (sesion) {
            cambiarEstado(sesion.usuario)
        }
    }
    useEffect(() => {
        if (estado.id === "") {
            validarEstadoFormulario(sesion);
        }
    });
    const subirFoto = fotos => {
        //1.capturar imagen
        const foto = fotos[0];
        //2.Renombrar imagne
        const claveUnicaFoto = uuidv4();
        //3.Obtener el nombre de la foto
        const nombreFoto = foto.name;
        //4.Obtener la extencion de la imagen
        const extencionFoto = nombreFoto.split('.').pop();
        //5. Crear el nuevo nombre de la foto
        const alias = (nombreFoto.split(".")[0] + "_" + claveUnicaFoto + "." + extencionFoto).replace(/\s/g, "_").toLowerCase();
        //6.llamada a firebase /server al metodo
        Firebase.guardarDocumento(alias, foto).then(metadata=>{
            Firebase.devolverDocumento(alias).then(urlFoto => {
                estado.foto = urlFoto;
                Firebase.db
                    .collection("Usuarios")
                    .doc(Firebase.auth.currentUser.uid)
                    .set(
                        {
                            foto: urlFoto
                        },
                        { merge: true }
                    ).then(userDB => {
                        dispatch({
                            type: "INICIAR_SESION",
                            sesion: estado,
                            autenticado: true
                        })
                    })
            })
        }).catch(error=>{
            openMensajePantalla(dispatch,{
                open:true,
                mensaje:"La imagen no cumple con las caracteristicas indicadas"
            })
        })

    }
    let fotoKey=uuidv4();
    return (sesion
        ? (
            <Container component="main" maxWidth="md" >
                <div style={styleForm.paperU}>
                    <Avatar style={styleForm.avatar} src={estado.foto || reactFoto}></Avatar>
                    <Typography component="h1" variant="h5"> Perfil de la cuenta {estado.tipo}</Typography>
                    <form style={styleForm.formU}>
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12}>
                                <TextField name="nombre" variant="outlined" value={estado.nombre} onChange={cambiarDato} fullWidth label="Nombre" ></TextField>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField name="apellido" variant="outlined" value={estado.apellido} onChange={cambiarDato} fullWidth label="Apellido"></TextField>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField name="correo" variant="outlined" value={estado.correo} onChange={cambiarDato} fullWidth label="Correo"></TextField>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField name="telefono" variant="outlined" value={estado.telefono} onChange={cambiarDato} fullWidth label="Telefono"></TextField>
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <ImageUploader
                                    withIcon={false}
                                    key={fotoKey}
                                    singleImagen={true}
                                    buttonText="Seleccione su imagen de perfil"
                                    onChange={subirFoto}
                                    imgExtension={['.jpg', '.gif', '.png', '.jpg']}
                                    maxFileSize={5242880}
                                />
                            </Grid>
                        </Grid>
                        <Grid container justify="center">
                            <Grid item md={6} xs={12}>
                                <Button type="submit" fullWidth variant="contained" color="primary" size="large" style={styleForm.submitU} onClick={guradarCambios}>Guardar Cambios</Button>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
        )
        : null
    );

}
export default consumerFirebase(PerfilUsuario);