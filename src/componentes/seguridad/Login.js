import React, { Component } from 'react';
import { Container, Avatar, Typography, TextField, Button, Grid } from '@material-ui/core';
import styleForm from '../estilos/estiloForm';
import Icono from "@material-ui/icons/LockOutlined";
import { compose } from 'recompose';
import { consumerFirebase } from '../../server';
import { iniciarSesion } from "../../sesion/actions/sesionAction";
import { StateContext } from "../../sesion/store";
import { openMensajePantalla } from '../../sesion/actions/snackbarAction';
import { Link } from 'react-router-dom';
import LoginTelefono from './LoginTelefono';

class Login extends Component {
    static contextType = StateContext;
    state = {
        Firebase: null,
        usuario: {
            correo: "",
            contraseña: ""
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
    cambiarState = e => {
        let UsuarioLogin = Object.assign({}, this.state.usuario);
        UsuarioLogin[e.target.name] = e.target.value;
        this.setState({
            usuario: UsuarioLogin
        })
    }
    Continuar = async e => {
        e.preventDefault();
        const [{ sesion }, dispatch] = this.context;
        const { Firebase, usuario } = this.state;
        const { correo, contraseña } = usuario;
        let callback = await iniciarSesion(dispatch, Firebase, correo, contraseña);
        if (callback.status) {
            this.props.history.push("/Inicio")
        } else {
            console.log(callback.mensaje.message)
            openMensajePantalla(dispatch, {
                open: true,
                mensaje: callback.mensaje.message
            })
        }

    }
    reseteraContraseña=()=>{
        const {Firebase,usuario}=this.state;
        const[{sesion},dispatch]=this.context;
        Firebase.auth.sendPasswordResetEmail(usuario.correo)
        .then(success=>{
            openMensajePantalla(dispatch,{
                open:true,
                mensaje:"se envio un correo electronico a tu cuenta para reestablecer tu contraseña"
            })
        })
        .catch(error=>{
            openMensajePantalla(dispatch,{
                open:true,
                mensaje:error.message
            })
        })
    }
    telefono=()=>{
        this.props.history.push("/auth/telefono");
    }
    render() {
        return (
            <Container maxWidth="md" >
                <div >
                    <br></br>
                    <div style={styleForm.paperLog}>
                        <Avatar style={styleForm.Avatar}>
                            <Icono></Icono>
                        </Avatar>
                        <br></br>
                        <Typography component="h1" variant="h5">Iniciar Sesion</Typography>
                        <form style={styleForm.formU}>
                            <TextField variant="outlined" fullWidth label="Correo" value={this.state.usuario.correo} onChange={this.cambiarState} name="correo" margin="normal" />
                            <TextField variant="outlined" fullWidth label="Contraseña" value={this.state.usuario.contraseña} onChange={this.cambiarState} margin="normal" type="password" name="contraseña" />
                            <Button fullWidth variant="contained" style={styleForm.submitU} onClick={this.Continuar} color="primary" type="submit">Iniciar</Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link  style={styleForm.link} variant="body2" onClick={this.reseteraContraseña}>
                                        {"Olvidaste tu contraseña"}
                                    </Link>
                                </Grid>
                                <Grid item >
                                    <Link style={styleForm.link} variant="body2" to="/auth/estudiante" >
                                        {"No tienes cuenta? registrate"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                        <Button variant="contained" color="primary" fullWidth style={styleForm.submitUI}  onClick={this.telefono}>
                            Ingresar con telefono
                        </Button>
                    </div>

                </div>
            </Container>
        );
    }
}

export default compose(consumerFirebase)(Login);