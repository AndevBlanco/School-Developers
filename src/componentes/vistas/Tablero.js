import React, { useRef ,useState} from 'react';
import CanvasDraw from 'react-canvas-draw';
import { useStateValue } from "../../sesion/store";
import { Grid, Button, TextField, Paper, Typography, Breadcrumbs } from '@material-ui/core';
import styleForm from '../estilos/estiloForm';
import HomeIcon from "@material-ui/icons/Home";
import { consumerFirebase } from '../../server';
import { openMensajePantalla } from "../../sesion/actions/snackbarAction";
import ImageUploader from "react-images-upload";
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
const style = {
    container: {
        paddingTop: "8px"
    },
    paper: {
        marginTop: 8,
        display: "flex",
        fexDirection: "column",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "#f5f5f5"
    },
    link: {
        display: "flex",
        textDecoration:"none",
        color:"inherit"
    },
    homeIcon: {
        width: 20,
        height: 20,
        marginRight: "4px"
    }, submit: {
        marginTop: 15,
        marginBottom: 10
    }, foto: {
        heigth: "200px",
        width: "300px"
    },border:{
        marginBottom:"10px"
    }
}
const Tablero= props => {
    const [{ sesion }, dispatch] = useStateValue();
    const Firebase =props.Firebase; 
    const primerDibujo = useRef(null);
    const segundoDibujo = useRef(null);
    let [estado, cambiarEstado] = useState({             // creando estado para componente plano
        tituloS:"",
        descripcionS:"",
        tableroS:"",
        foto:""
    })
    const cambiarDato = e => {
        const { name, value } = e.target;
        cambiarEstado(prev => ({
            ...prev,
            [name]: value
        }))
    }
    const guardar = () => {
        const { id } = props.match.params;
        const imagen = primerDibujo.current.getSaveData();
        console.log(imagen);
        console.log(estado);
        console.log(id);
        segundoDibujo.current.loadSaveData(imagen, false);
        estado.tableroS=imagen;

    }
    const borrar = () => {
        primerDibujo.current.clear();
    }
    const volver = () => {
        primerDibujo.current.undo();
    }
    const subir=()=>{
        const { id } = props.match.params;
        const dibujo= primerDibujo.current.getSaveData();
        console.log(dibujo);
        console.log(id);
        estado.tableroS=dibujo;
        Firebase.db
        .collection("Problemas")
        .doc(id)
        .set({solucion:estado}, { merge: true })
        .then(success => {
            props.history.push("/problemas/publicos");
        })
    }
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
    return (
        <Paper style={style.paper}>
            <div style={styleForm.paperTab}>
                <div style={styleForm.formTab}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Link color="inherit" style={style.link} to="/Inicio">
                                    <HomeIcon style={style.homeIcon} />
                                Inicio
                                </Link>
                                <Typography color="textPrimary">Solucion</Typography>
                            </Breadcrumbs>
                        </Grid>
                        <Grid container spacing={1}  >
                            <Grid item md={1} xs={3}>
                                <Button onClick={guardar} variant="contained" color="primary">Guardar</Button>
                            </Grid >
                            <Grid item md={1} xs={3}>
                                <Button onClick={borrar} variant="contained" color="primary" >Borrar</Button>
                            </Grid>

                            <Grid item md={1} xs={3}>
                                <Button onClick={volver} variant="contained" color="primary" >Volver</Button>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12}>
                                <CanvasDraw brushColor="#130f40" canvasHeight={"500px"} canvasWidth={"100%"} brushRadius={1} ref={primerDibujo} style={{ border: "2px solid black" }} />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <CanvasDraw ref={segundoDibujo} hideGrid="true" disabled="true" canvasHeight={"500px"} canvasWidth={"100%"} brushColor="#130f40" brushRadius={1} style={{ border: "2px solid black" }} />
                            </Grid>
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
                        <Grid item xs={12} md={6}>
                            <TextField name="tituloS" value={estado.tituloS} onChange={cambiarDato} fullWidth label="Titulo de tu solucion"  />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField name="descripcionS" value={estado.descripcionS} onChange={cambiarDato} fullWidth label="descripcion de tu solucion"   />
                        </Grid>
                        <Grid container justify="center">
                            <Grid item xs={12} md={6}>
                                <Button type="button" fullWidth variant="contained" size="large" onClick={subir} color="primary" style={style.submit}>Subir Solucion</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </Paper>
    );
}


export default consumerFirebase(Tablero);