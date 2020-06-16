import React, { Component } from 'react';
import { Container, Paper, Grid, Breadcrumbs, Link, Typography, TextField, Button, Table, TableBody, TableRow, TableCell } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import { consumerFirebase } from "../../server";
import { openMensajePantalla } from "../../sesion/actions/snackbarAction";
import ImageUploader from "react-images-upload";
import { v4 as uuidv4 } from 'uuid';
import { crearKeyword } from '../../sesion/actions/Keyword';

const style = {
    container: {
        paddingTop: "8px"
    },
    paper: {
        marginTop: 8,
        display: "flex",
        fexDirection: "column",
        alignItems: "center",
        padding: 40,
        backgroundColor: "#f5f5f5"
    },
    link: {
        display: "flex"
    },
    homeIcon: {
        width: 20,
        heigth: 20,
        marginRigth: "4px"
    },
    submit: {
        marginTop: 15,
        marginBottom: 10
    },
    foto: {
        heigth:"200px",
        width:"300px"
    }
}
class NuevoProblema extends Component {
    state = {
        problema: {
            titulo: "",
            categoria: "",
            descripcionGeneral: "",
            ciudad: "",
            pais: "",
            descripcionEspecifica: "",
            fotos:""
        },
        archivos: []
    }
    subirArchivos = documentos => {
        Object.keys(documentos).forEach(function (key) {
            documentos[key].urlTemp = URL.createObjectURL(documentos[key]);
        })
        this.setState({
            archivos: this.state.archivos.concat(documentos)
        })
    }
    entraDatoEnEstado = e => {
        let nuevoProblema = Object.assign({}, this.state.problema);
        nuevoProblema[e.target.name] = e.target.value;
        this.setState({
            problema: nuevoProblema
        })
    }
    guardarProblema = e => {
        const { archivos, problema } = this.state;
        //crear a cada archivo un alias con el cual se invocara en el futuro y se almacenara en la base de datos
        Object.keys(archivos).forEach(function (key) {
            let valorDinamico = Math.floor(new Date().getTime() / 1000);
            let nombre = archivos[key].name;
            let extension = nombre.split(".").pop();
            archivos[key].alias = (nombre.split(".")[0] + "_" + valorDinamico + "." + extension).replace(/\s/g, "_").toLowerCase();
        })
        
        const textoBusqueda = problema.titulo + ' ' + problema.categoria + ' ' + problema.ciudad;
        let keywords = crearKeyword(textoBusqueda);
        this.props.Firebase.guardarDocumentos(archivos).then(arregloUrls => {
            problema.fotos = arregloUrls;
            problema.keywords = keywords;
            problema.propietario=this.props.Firebase.auth.currentUser.uid;
            this.props.Firebase.db
                .collection("Problemas")
                .add(problema)
                .then(success => {
                    this.props.history.push("/Inicio/Listadeproblemas")
                })
                .catch(error => {
                    openMensajePantalla({
                        open: true,
                        mensaje: error
                    })
                })
        })


    }
    eliminarArchivo = nombreArchivo => () => {
        this.setState({
            archivos: this.state.archivos.filter(archivo => {
                return archivo.name !== nombreArchivo
            })
        })
    }

    render() {
        let imagekey = uuidv4();
        return (
            <Container style={style.container}>
                <Paper style={style.paper}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Breadcrumbs aria-label="Breadcrumbs">
                                <Link color="inherit" style={style.link} href="/Inicio">
                                    <HomeIcon style={style.homeIcon} />
                                Inicio
                                </Link>
                                <Typography color="textPrimary">Nuevo Problema</Typography>
                            </Breadcrumbs>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField name="titulo" value={this.state.problema.titulo} onChange={this.entraDatoEnEstado} label="Titulo del problema" fullWidth />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField name="categoria" value={this.state.problema.categoria} onChange={this.entraDatoEnEstado} multiline label="Categoria del problema" fullWidth />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField name="descripcionGeneral" value={this.state.problema.descripcionGeneral} onChange={this.entraDatoEnEstado} multiline label="Descripcion general" fullWidth />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField name="ciudad" value={this.state.problema.ciudad} onChange={this.entraDatoEnEstado} label="Ciudad" fullWidth />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField name="pais" value={this.state.problema.pais} onChange={this.entraDatoEnEstado} label="Pais" fullWidth />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField name="descripcionEspecifica" value={this.state.problema.descripcionEspecifica} onChange={this.entraDatoEnEstado} multiline label="Descripcion especifica" fullWidth />
                        </Grid>


                        <Grid container justify="center">
                            <Grid xs={12} sm={6}>
                                <ImageUploader
                                    key={imagekey}
                                    withIcon={true}
                                    buttonText="Selecione Archivos"
                                    onChange={this.subirArchivos}
                                    imgExtension={[".jpg", ".gif", ".png", ".jpeg","jfif"]}
                                    maxFileSize={5242880}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <Table>
                                    <TableBody>
                                        {
                                            this.state.archivos.map((archivo, i) => (
                                                <TableRow key={i}>
                                                    <TableCell align="left">
                                                        <img src={archivo.urlTemp} style={style.foto} />
                                                    </TableCell>
                                                    <Button variant="contained" onClick={this.eliminarArchivo(archivo.name)} color="secondary" size="small">Eliminar</Button>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
                        <Grid container justify="center">
                            <Grid item xs={12} md={6}>
                                <Button type="button" onClick={this.guardarProblema} fullWidth variant="contained" size="large" color="primary" style={style.submit}>Guardar</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        );
    }
}

export default consumerFirebase(NuevoProblema);