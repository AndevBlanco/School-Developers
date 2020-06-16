import React, { Component } from 'react';
import { Button, Container, Paper, Grid, Breadcrumbs, Typography, TextField, Card, CardMedia, CardContent, CardActions, ButtonGroup } from '@material-ui/core';
import { consumerFirebase } from "../../server";
import CanvasDraw from 'react-canvas-draw';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import HomeIcon from "@material-ui/icons/Home";
import { Link } from 'react-router-dom';


const style = {
    cardGrid: {
        paddingTop: 8,
        paddingBottom: 8
    },
    paper: {
        background: "#f5f5f5",
        padding: "20px",
        minHeight: 650
    },
    link: {
        display: "flex",
        textDecoration:"none",
        color:"inherit"
    },
    gridTextfield: {
        marginTop: "20px"
    },
    card: {
        height: "100%",
        display: "flex",
        flexDirection: "column"
    },
    cardMedia: {

        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1
    },
    barraBoton: {
        marginTop: "20px"
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden'
    },
    gridList: {
        width: 900,
        height: 350,
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
    marg:{
        marginTop:"100px",
        marginBottom:"100px"
    }
}

class DetallesProblema extends Component {
    state = {
        problema: {
            titulo: "",
            categoria: "",
            descripcionGeneral: "",
            ciudad: "",
            pais: "",
            descripcionEspecifica: "",
            fotos: [],
            tablero: "",
            solucion: [],
        }
    }
    async componentDidMount() {
        const { id } = this.props.match.params;// capturando valor de id
        const problemaCollection = this.props.Firebase.db.collection("Problemas");
        const problemaDB = await problemaCollection.doc(id).get();
        this.setState({
            problema: problemaDB.data()
        })
    }
    render() {
        const ColoredLine = ({ color }) => (
            <hr
                style={{
                    color: color,
                    backgroundColor: color,
                    height: 5
                }}
            />
        );
        return (
            <div>
               
                <Container style={style.cardGrid}>
                    <Paper style={style.paper}>
                        <Grid item xs={12} sm={12} style={style.gridTextfield}>
                            <Grid item xs={12} md={8}>
                                <Breadcrumbs aria-label="breadcrumb" >
                                    <Link color="inherit" style={style.link} to="/Inicio">
                                        <HomeIcon style={style.homeIcon} />
                                Inicio
                                </Link>
                                    <Typography color="textPrimary">Solucion</Typography>
                                </Breadcrumbs>
                            </Grid>
                            <Typography component="h1" variant="h3" spacing={10} style={style.marg} > Problema de {this.state.problema.categoria}</Typography>
                            <Grid container spacing={4} direction="row">
                                <Grid item xs={12}>
                                    <Card style={style.card}>
                                        <CardContent style={style.cardContent}>
                                            <Typography gutterBottom variant="initial" component="h1">
                                                {this.state.problema.titulo}
                                            </Typography>
                                            <Typography variant="h5" component="h2">
                                                {this.state.problema.descripcionGeneral}
                                            </Typography>

                                            <Typography variant="h5" component="h2">
                                                {this.state.problema.descripcionEspecifica}
                                            </Typography>
                                            <CardContent>
                                                <div style={style.root}>
                                                    <GridList cellHeight={400} style={style.gridList}>
                                                        {this.state.problema.fotos.map((tile) => (
                                                            <GridListTile key={tile.img}>
                                                                <img src={tile} />
                                                            </GridListTile>
                                                        ))}
                                                    </GridList>
                                                </div>
                                            </CardContent>
                                            <Typography color="textSecondary">
                                                <br></br>
                                                Ciudad:{this.state.problema.ciudad}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                            <ColoredLine color="rgba(0, 41, 90, 0.945)" />
                            <Typography component="h1" variant="h3" spacing={10}> Solucion</Typography>
                            {this.state.problema.solucion ? (
                                <Grid container justify="center" spacing={4} direction="row">
                                    <Grid item xs={12} >
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography gutterBottom variant="initial" component="h2">
                                                    {this.state.problema.solucion.tituloS}
                                                </Typography>
                                                <Typography variant="h5" component="h2">
                                                    {this.state.problema.solucion.descripcionS}
                                                </Typography>
                                                <CanvasDraw hideGrid="true" disabled="true" saveData={this.state.problema.solucion.tableroS} canvasHeight={"500px"} canvasWidth={"100%"} brushColor="#130f40" brushRadius={1} style={{ border: "2px solid black" }} />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            ) : ""
                            }
                        </Grid>
                    </Paper>
                </Container>
            </div>
        );
    }
}

export default consumerFirebase(DetallesProblema);