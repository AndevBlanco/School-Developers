import React, { Component } from 'react';
import { Container, Avatar, Typography, Grid, TextField, Button } from '@material-ui/core';
import styleForm from '../estilos/estiloForm';
import IconoFormulario from "@material-ui/icons/SupervisedUserCircle"
import { compose } from "recompose";
import { consumerFirebase } from "../../server";
import {crearUsuario} from "../../sesion/actions/sesionAction";
import {openMensajePantalla} from "../../sesion/actions/snackbarAction";
import {StateContext} from "../../sesion/store";
class RegistrarProfesor extends Component {
    static contextType=StateContext;
    state = {
        Firebase: null,
        usuario: {
            nombre: "",
            apellido: "",
            correo: "",
            contraseña: "",
            tipo: "Profesor"
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.Firebase === prevState.Firebase) {
            return null;
        }
        return {
            Firebase: nextProps.Firebase
        }
    }
    guardarEstado = e => {
        let UsuarioEstudiante = Object.assign({}, this.state.usuario);
        UsuarioEstudiante[e.target.name] = e.target.value;
        this.setState({
            usuario: UsuarioEstudiante
        })
    }
    registrarProfesor= async e => {
        e.preventDefault();
        const [{sesion},dispatch]=this.context;
        const {Firebase,usuario}=this.state;
        let callback= await crearUsuario(dispatch,Firebase,usuario)
        if(callback.status){
            this.props.history.push("/IniciarSesion");
        }else{
            openMensajePantalla(dispatch,{
                open:true,
                mensaje:callback.mensaje.message
            })
        }
    }
    render() {
        return (
            <Container maxWidth="md">
                <div style={styleForm.paper}>
                    <Avatar style={styleForm.Avatar}>
                        <IconoFormulario />
                    </Avatar>
                    <br></br>
                    <Typography component="h1" variant="h5" >Crea una cuenta Profesor</Typography>
                    <form style={styleForm.formulario}>
                        <Grid container spacing={2} >
                            <Grid item md={12} xs={12}>
                                <TextField variant="outlined" margin="normal" name="nombre" onChange={this.guardarEstado} value={this.state.usuario.nombre} fullWidth label="Ingrese su nombre" />
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <TextField variant="outlined" margin="normal" name="apellido" onChange={this.guardarEstado} value={this.state.usuario.apellido} fullWidth label="Ingrese su apellido" />
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <TextField variant="outlined" margin="normal" name="correo" onChange={this.guardarEstado} value={this.state.usuario.correo} fullWidth label="Ingrese su correo" />
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <TextField variant="outlined" margin="normal" name="contraseña" onChange={this.guardarEstado} value={this.state.usuario.contraseña} type="password" fullWidth label="Ingrese su contraseña" />
                            </Grid>
                        </Grid>
                        <Grid container justify="center">
                            <Grid item xs={12} md={12}>
                                <Button onClick={this.registrarEstudiante} type="submit" variant="contained" fullWidth size="large" color="primary" style={styleForm.submit}>Registrarse</Button>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
            </Container>
        );
    }
}

export default compose(consumerFirebase)(RegistrarProfesor);