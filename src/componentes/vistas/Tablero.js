import React, { useRef } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { Grid, Button, TextField, Paper, Link, Typography, Breadcrumbs } from '@material-ui/core';
import styleForm from '../estilos/estiloForm';
import HomeIcon from "@material-ui/icons/Home";
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
        padding: "20px",
        backgroundColor: "#f5f5f5f5"
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
        marginBottom:"100px"
    }
}
function Tablero() {

    const primerDibujo = useRef(null);
    const segundoDibujo = useRef(null);
    const guardar = () => {
        const imagen = primerDibujo.current.getSaveData();
        console.log(imagen);
        segundoDibujo.current.loadSaveData(imagen, false);
    }
    const borrar = () => {
        primerDibujo.current.clear();
    }
    const volver = () => {
        primerDibujo.current.undo();
    }
    return (
        <Paper style={style.paper}>
            <div style={styleForm.paperTab}>
                <div style={styleForm.formTab}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Link color="inherit" style={style.link} href="/">
                                    <HomeIcon style={style.homeIcon} />
                                Inicio
                                </Link>
                                <Typography color="textPrimary">Solucion</Typography>
                            </Breadcrumbs>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField name="titulo" fullWidth />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField name="categoria" fullWidth />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField name="descripcionGeneral" fullWidth />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField name="ciudad" fullWidth />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField name="pais" fullWidth />
                        </Grid>
                        <Grid  style={style.border}item xs={12} md={12}>
                            <TextField name="descripcionEspecifica" fullWidth />
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
                            <Grid item md={1} xs={3}>
                                <Button onClick={volver} variant="contained" color="primary" >Subir</Button>
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
                        <Grid container justify="center">
                            <Grid item xs={12} md={6}>
                                <Button type="button" fullWidth variant="contained" size="large" color="primary" style={style.submit}>Guardar</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </Paper>
    );
}


export default Tablero;