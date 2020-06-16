import React, { Component } from 'react';
import * as firebaseui from "firebaseui"
import { Container, Avatar, Typography, Grid, TextField, Button, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions } from '@material-ui/core';
import LockOutlineIcon from "@material-ui/icons/LockOutlined";
import styleForm from '../estilos/estiloForm';
import { consumerFirebase } from '../../server';
import { StateContext } from "../../sesion/store";
import { openMensajePantalla } from "../../sesion/actions/snackbarAction";
import { Link } from 'react-router-dom';

class LoginTelefono extends Component {
    static contextType = StateContext;
    state = {
        disable: true,
        dialogAbierto: false,
        codigoConfirmacion: null,
        usuario: {
            telefono: '',
            codigo: ""
        }
    }
    componentDidMount() {
        const { Firebase } = this.props;
        Firebase.auth.languageCode = "es";
        window.recaptchaVerifier = new Firebase.authorization.RecaptchaVerifier(
            this.recaptcha,
            {
                size: "normal",
                callback: response => {
                    this.setState({
                        disable: false
                    })
                },
                "expired-callback": function () {
                    this.setState({
                        disable: true
                    });
                    window.location.reload();
                }
            }
        );
        window.recaptchaVerifier.render().then(function (widgetID) {
            window.recaptchaVerifierId = widgetID;
        });
    }
    verificarNumero = e => {
        e.preventDefault();
        const { Firebase } = this.props;
        const appVerificacion = window.recaptchaVerifier;
        const [{ sesion }, dispatch] = this.context;
        Firebase.auth
            .signInWithPhoneNumber(this.state.usuario.telefono, appVerificacion)
            .then(codigoEnviado => {
                this.setState({
                    dialogAbierto: true,
                    codigoConfirmacion: codigoEnviado,
                })
            })
            .catch(error => {
                openMensajePantalla(dispatch, {
                    open: true,
                    mensaje: error.message
                })
            })

    }
    onChange = e => {
        let usuario = Object.assign({}, this.state.usuario);
        usuario[e.target.name] = e.target.value;
        this.setState({ usuario })
    }
    LoginConTelefono = () => {
        const { Firebase } = this.props;
        let credencial = Firebase.authorization.PhoneAuthProvider.credential(this.state.codigoConfirmacion.verificationId, this.state.usuario.codigo);
        const [{ usuario }, dispatch] = this.context;
        Firebase.auth
            .signInAndRetrieveDataWithCredential(credencial)
            .then(authUser => {
                Firebase.db
                    .collection("Usuarios")
                    .doc(authUser.user.uid)
                    .set({
                        id: authUser.user.uid,
                        telefono: authUser.user.phoneNumber
                    }, { merge: true })
                    .then(success => {
                        Firebase.db
                            .collection("Usuarios")
                            .doc(authUser.user.uid)
                            .get()
                            .then(doc => {
                                dispatch({
                                    type: "INICIAR_SESION",
                                    sesion: doc.data(),
                                    autenticado: true
                                });
                                this.props.history.push("/editar/perfil")
                            })
                    })
                    .catch(error => {
                        openMensajePantalla(dispatch, {
                            open: true,
                            mensaje: error.message
                        })
                    })
            })
            .catch(error => {
                openMensajePantalla(dispatch, {
                    open: true,
                    mensaje: error.message
                })
            })
    }
    render() {
        return (
            
            <Container maxWidth="xs" >
                <Dialog open={this.state.dialogAbierto} onClose={() => { this.setState({ dialogAbierto: false }) }}>
                    <DialogContent>
                        <DialogTitle>Ingresa tu codigo</DialogTitle>
                        <DialogContentText>
                            Ingresa el codigo enviado a tu celular
                        </DialogContentText>
                        <TextField autoFocus margin="dense" name="codigo" value={this.state.usuario.codigo} onChange={this.onChange} fullWidth />
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={() => { this.setState({ dialogAbierto: false }) }}> Cancelar</Button>
                        <Button color="primary" onClick={this.LoginConTelefono} > Verificar</Button>
                    </DialogActions>
                </Dialog>

                <div style={styleForm.paperU}>
                    <Avatar style={styleForm.Avatar}>
                        <LockOutlineIcon />
                    </Avatar>
                    <br></br>
                    <Typography component="h1" variant="h5">
                        Ingrese numero telefonico
                    </Typography>
                    <form style={styleForm.formUT}>
                        <Grid style={styleForm.captcha} justify="center" container>
                            <div ref={ref => (this.recaptcha = ref)}></div>
                        </Grid>
                        <TextField
                            variant="outlined"
                            fullWidth
                            name="telefono"
                            label="Ingresa tu numero telefonico"
                            value={this.state.usuario.telefono} onChange={this.onChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={this.verificarNumero}
                            style={styleForm.submitU}
                            disabled={this.state.disable}
                        >
                            Enviar
                        </Button>
                    </form>
                    <Grid container >
                            <Grid item xs >
                                <Link style={styleForm.link} to="/" variant="body2">
                                    {"Ya tengo una cuenta"}
                                </Link>
                            </Grid>
                        </Grid>
                </div>
            </Container>
        );
    }
}

export default consumerFirebase(LoginTelefono);