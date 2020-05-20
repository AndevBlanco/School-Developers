import React, { Component } from 'react';
import { Container, Avatar, Typography, TextField, Button } from '@material-ui/core';
import styleForm from '../estilos/estiloForm';
import Icono from "@material-ui/icons/LockOutlined";
import { compose } from 'recompose';
import { consumerFirebase } from '../../server';
import {iniciarSesion} from "../../sesion/actions/sesionAction";
import {StateContext} from "../../sesion/store";
import {openMensajePantalla} from '../../sesion/actions/snackbarAction';

class Login extends Component {
    static contextType=StateContext;
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
        const [{sesion},dispatch]=this.context;
        const {Firebase, usuario}=this.state;
        const {correo,contraseña}=usuario;
        let callback = await iniciarSesion(dispatch,Firebase,correo,contraseña);
        if(callback.status){
            this.props.history.push("/")
        }else{
            console.log(callback.mensaje.message)
            openMensajePantalla(dispatch,{
                open:true,
                mensaje:callback.mensaje.message
            })
        }
        
    }
    render() {
        return (
            <Container maxWidth="xs">
                <div style={styleForm.paper}>
                    <Avatar style={styleForm.Avatar}>
                        <Icono></Icono>
                    </Avatar>
                    <Typography component="h1" variant="h5">Ingresa tus datos</Typography>
                    <form style={styleForm.formulario}>
                        <TextField variant="outlined" fullWidth label="Correo" value={this.state.usuario.correo} onChange={this.cambiarState} name="correo" margin="normal" />
                        <TextField variant="outlined" fullWidth label="Contraseña" value={this.state.usuario.contraseña} onChange={this.cambiarState} margin="normal" type="password" name="contraseña" />
                        <Button fullWidth variant="contained" onClick={this.Continuar} color="primary" type="submit">Iniciar</Button>
                    </form>
                </div>
            </Container>
        );
    }
}

export default compose(consumerFirebase)(Login);