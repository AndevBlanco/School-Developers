import React, { Component } from 'react';
import { Button, Container, Paper, Grid, Breadcrumbs, Typography, TextField, Card, CardMedia, CardContent, CardActions, ButtonGroup } from '@material-ui/core';
import HomeIcon from "@material-ui/icons/Home";
import fondo1 from "../../logo.svg";
import { consumerFirebase } from "../../server";
import ArrowLeft from "@material-ui/icons/ArrowLeft";
import ArrowRight from "@material-ui/icons/ArrowRight";
import { obtenerData ,obtenerDataAnterior} from '../../sesion/actions/ProblemaAction';
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
    }
}
class ListaProblemasPublicos extends Component {
    state = {
        problemas: [],
        textoBusqueda: "",
        paginas: [],
        paginaSize: 6,
        problemaInicial: null,
        paginaActual: 0
    }
    cambiarBusquedaTexto = e => {
        const self = this;
        self.setState({
            [e.target.name]: e.target.value
        })
        if (self.state.typingTimeout) {
            clearTimeout(self.state.typingTimeout);
        }
        self.setState({
            name: e.target.value,
            typing: false,
            typingTimeout: setTimeout(goTime => { 
                
                let objectQuery = this.props.Firebase.db
                    .collection("Problemas")
                    .orderBy("categoria")
                    .where("keywords", "array-contains", self.state.textoBusqueda.toLowerCase());

                if (self.state.textoBusqueda.trim() === "") {
                    objectQuery = this.props.Firebase.db
                        .collection("Problemas")
                        .orderBy("categoria");
                }

                objectQuery.get().then(snapshot => {
                    const arrayProblema = snapshot.docs.map(doc => {
                        let data = doc.data();
                        let id = doc.id;
                        return { id, ...data }
                    })
                    console.log(arrayProblema);
                    this.setState({
                        problemas: arrayProblema
                    })
                })
            }, 500)
        })
    }
    siguientePagina = () => {
        const { paginaActual, paginaSize, textoBusqueda, paginas } = this.state;
        const Firebase = this.props.Firebase;
        obtenerData(Firebase, paginaSize, paginas[paginaActual].finalValor, textoBusqueda).then(firebaseReturnData => {
            if (firebaseReturnData.arrayProblemas.length > 0) {
                const pagina = {
                    inicialValor: firebaseReturnData.inicialValor,
                    finalValor: firebaseReturnData.finalValor
                }
                paginas.push(pagina);
                this.setState({
                    paginas,
                    paginaActual: paginaActual + 1,
                    problemas: firebaseReturnData.arrayProblemas
                })
            }
        })
    }
    anteriorPagina=()=>{
        const { paginaActual, paginaSize, textoBusqueda, paginas } = this.state;
        const Firebase = this.props.Firebase;
        
        if(paginaActual>0){ 
            obtenerDataAnterior(Firebase,paginaSize,paginas[paginaActual-1].inicialValor,textoBusqueda).then(firebaseReturnData=>{
                const pagina ={
                    inicialValor:firebaseReturnData.inicialValor,
                    finalValor:firebaseReturnData.finalValor,
                }
                paginas.push(pagina);
                this.setState({
                    paginas,
                    paginaActual:paginaActual-1,
                    problemas:firebaseReturnData.arrayProblemas 
                })
            })
        }
    }
    async componentDidMount() {
        const { paginaSize, textoBusqueda, problemaInicial, paginas } = this.state;

        const Firebase = this.props.Firebase;

        const firebaseReturnData = await obtenerData(Firebase, paginaSize, problemaInicial, textoBusqueda);

        const pagina = {
            inicialValor: firebaseReturnData.inicialValor,
            finalValor: firebaseReturnData.finalValor
        }

        paginas.push(pagina)
        this.setState({
            problemas: firebaseReturnData.arrayProblemas,
            paginas,
            paginActual: 0
        })
    }
    solucionarProblema = id => {
        this.props.history.push("/solucionar/editar/"+ id);
    }
    verProblema = id => {
        this.props.history.push("/Inicio/detalles/"+ id);
    }
    render() {
        return (
            <div>
                <Container style={style.cardGrid}>
                    <Paper style={style.paper}>
                        <Grid item xs={12} sm={12}>
                            <Breadcrumbs aria-label="breadcrumbs">
                                <Link color="inherit"  style={style.link} to="/Inicio">
                                    <HomeIcon />
                                    Inicio
                                </Link>
                                <Typography color="textPrimary">Problemas</Typography>
                            </Breadcrumbs>
                        </Grid>
                        <Grid item xs={12} sm={6} style={style.gridTextfield}>
                            <TextField fullWidth InputLabelProps={{ shrink: true }} value={this.state.textoBusqueda} onChange={this.cambiarBusquedaTexto} name="textoBusqueda" variant="outlined" label="buscar problema" />
                        </Grid>
                        <Grid item sm={12} xs={12} style={style.barraBoton}>
                            <Grid container spacing={1} direction="column" alignItems="flex-end">
                                <ButtonGroup size="small" aria-label="Small outlined group">
                                    <Button>
                                        <ArrowLeft onClick={this.anteriorPagina} />
                                    </Button>
                                    <Button>
                                        <ArrowRight onClick={this.siguientePagina}/>
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sm={12} style={style.gridTextfield}>
                            <Grid container spacing={4}>
                                {this.state.problemas.map(card => (
                                    <Grid item key={card.id} xs={12} sm={6} md={4}>
                                        <Card style={style.card}>
                                            <CardMedia
                                                style={style.cardMedia}
                                                image={
                                                    card.fotos
                                                        ? card.fotos[0]
                                                            ? card.fotos[0]
                                                            : fondo1
                                                        : fondo1
                                                }
                                                title="Mi problema"
                                            />
                                            <CardContent style={style.cardContent}>
                                                <Typography gutterBottom variant="h5" component="h2">
                                                    {card.titulo + " - " + card.categoria}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button
                                                    size="medium"
                                                    color="primary"
                                                    onClick={() => this.solucionarProblema(card.id)}
                                                >
                                                    Solucionar
                                                </Button>
                                                <Button
                                                    size="medium"
                                                    color="primary"
                                                    onClick={() => this.verProblema(card.id)}
                                                >
                                                    ve Problema
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>


                    </Paper>
                </Container>
            </div>
        );
    }
}

export default consumerFirebase(ListaProblemasPublicos);