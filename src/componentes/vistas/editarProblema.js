import React, { Component } from 'react';
import { consumerFirebase } from "../../server";
import { Paper, Container, Grid, Breadcrumbs, Link, Typography, TextField, Button, Table, TableBody, TableRow, TableCell } from "@material-ui/core"
import HomeIcon from "@material-ui/icons/Home";
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
    }
}

class EditarProblema extends Component {
    state = {
        problema: {
            titulo: "",
            categoria: "",
            descripcionGeneral: "",
            ciudad: "",
            pais: "",
            descripcionEspecifica: "",
            fotos: []
        }
    }
    cambiarDato = e => {
        let nuevoProblema = Object.assign({}, this.state.problema);
        nuevoProblema[e.target.name] = e.target.value;
        this.setState({
            problema: nuevoProblema
        })
    }
    subirArchivos = imagenes => {
        const { problema } = this.state;
        const { id } = this.props.match.params;
        Object.keys(imagenes).forEach(key => {
            let codigoDinamico = uuidv4();
            let nombreImagen = imagenes[key].name;
            let extension = nombreImagen.split(".").pop();
            imagenes[key].alias = (nombreImagen.split(".")[0] + "_" + codigoDinamico + "." + extension).replace(/\s/g, "_").toLowerCase()

        })
        this.props.Firebase.guardarDocumentos(imagenes).then(urlImagenes => {
            problema.fotos = problema.fotos.concat(urlImagenes);
            this.props.Firebase.db
                .collection("Problemas")
                .doc(id)
                .set(problema, { merge: true })
                .then(success => {
                    this.setState({
                        problema
                    })
                })
        })
    }
    eliminarArchivo = fotoUrl => async () => {
        const { problema } = this.state;
        const { id } = this.props.match.params;
        let fotoID = fotoUrl.match(/[\w-]+.(jpg|png|jepg|gif|svg)/);
        fotoID = fotoID[0];
        await this.props.Firebase.eliminarDocumento(fotoID);

        let fotoList = this.state.problema.fotos.filter(foto => {
            return foto !== fotoUrl;
        })
        problema.fotos = fotoList;

        this.props.Firebase.db
            .collection("Problemas")
            .doc(id)
            .set(problema, { merge: true })
            .then(success => {
                this.setState({
                    problema
                })
            })

    }
    async componentDidMount() {
        const { id } = this.props.match.params;// capturando valor de id
        const problemaCollection = this.props.Firebase.db.collection("Problemas");
        const problemaDB = await problemaCollection.doc(id).get();
        this.setState({
            problema: problemaDB.data()
        })
    }
    guardarProblema=()=>{
        const {id}=this.props.match.params;
        const {problema} = this.state;
        const textoBusqueda=problema.titulo+" "+problema.categoria+" "+problema.descripcionGeneral;
        const keywords = crearKeyword(textoBusqueda);
        problema.keywords=keywords;
        this.props.Firebase.db
        .collection("Problemas")
        .doc(id)
        .set(problema,{merge:true})
        .then(success=>{
            this.props.history.push("/ListaProblemas");
        })
    }
    render() {
        let uniqueID = uuidv4();
        return (
            <Container style={style.container}>
                <Paper style={style.paper}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Link color="inherit" style={style.link} href="/">
                                    <HomeIcon style={style.homeIcon} />
                                Inicio
                            </Link>
                                <Typography color="textPrimary">Editar Problema</Typography>
                            </Breadcrumbs>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField name="titulo" onChange={this.cambiarDato} value={this.state.problema.titulo} label="Titulo del problema" fullWidth />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField name="categoria" onChange={this.cambiarDato} value={this.state.problema.categoria} multiline label="Categoria del problema" fullWidth />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField name="descripcionGeneral" onChange={this.cambiarDato} value={this.state.problema.descripcionGeneral} multiline label="Descripcion general" fullWidth />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField name="ciudad" onChange={this.cambiarDato} value={this.state.problema.ciudad} label="Ciudad" fullWidth />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField name="pais" onChange={this.cambiarDato} value={this.state.problema.pais} label="Pais" fullWidth />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField name="descripcionEspecifica" onChange={this.cambiarDato} value={this.state.problema.descripcionEspecifica} multiline label="Descripcion especifica" fullWidth />
                        </Grid>
                        <Grid container justify="center">
                            <Grid xs={12} sm={6}>
                                <ImageUploader
                                    key={uniqueID}
                                    withIcon={true}
                                    buttonText="Selecione Archivos"
                                    onChange={this.subirArchivos}
                                    imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                                    maxFileSize={5242880}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <Table>
                                    <TableBody>
                                        {
                                            this.state.problema.fotos
                                                ? this.state.problema.fotos.map((foto, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell align="left">
                                                            <img src={foto} style={style.foto} />
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Button variant="contained" onClick={this.eliminarArchivo(foto)} color="secondary" size="small">Eliminar</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )) : ""
                                        }
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
                        <Grid container justify="center">
                            <Grid item xs={12} md={6}>
                                <Button type="button"onClick={this.guardarProblema} fullWidth variant="contained" size="large" color="primary" style={style.submit}>Guardar</Button>
                            </Grid>
                        </Grid>
                    </Grid>


                </Paper>
            </Container>
        );
    }
}

export default consumerFirebase(EditarProblema);