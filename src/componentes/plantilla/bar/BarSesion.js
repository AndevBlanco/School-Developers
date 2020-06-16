import React, { Component, Fragment } from 'react';
import { Toolbar, Typography, Button, IconButton, Drawer, Avatar } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import styles from '../../estilos/estilos';
import { consumerFirebase } from "../../../server";
import { compose } from "recompose";
import { StateContext } from "../../../sesion/store";
import { cerrarSesion } from "../../../sesion/actions/sesionAction";
import { MenuDerecha } from "./menuDerecha";
import { Link } from "react-router-dom";
import Foto from "../../../logo.svg";
import { withRouter } from 'react-router-dom';
import { MenuIzquierda } from './menuIzquierda';

class BarSesion extends Component {
    static contextType = StateContext;
    state = {
        Firebase: null,
        right: false,
        left: false
    }
    cerrarSesionApp = () => {
        const { Firebase } = this.state;
        const [{ sesion }, dispatch] = this.context;

        cerrarSesion(dispatch, Firebase).then(success => {
            this.props.history.push("/");
        })
    }
    toggleDrawer = (side, open) => () => {
        this.setState(
            {
                [side]: open
            }
        )
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        let nuevosObjetos = {};
        if (nextProps.Firebase !== prevState.Firebase) {
            nuevosObjetos.Firebase = nextProps.Firebase;
        }
        return nuevosObjetos;
    }

    render() {
        const { classes } = this.props;
        const [{ sesion }, dispatch] = this.context;
        const { usuario } = sesion;
        let textoUsuario = usuario.nombre + " " + usuario.apellido;
        if (!usuario.nombre) {
            textoUsuario = usuario.telefono;
        }


        return (
            <Fragment>
                <Drawer
                    open={this.state.left}
                    onClose={this.toggleDrawer("left", false)}
                    anchor="left"
                >
                    <div
                        role="button"
                        onClick={this.toggleDrawer("left", false)}
                        onKeyDown={this.toggleDrawer("left", false)}
                    >
                        <MenuIzquierda classes={classes} />
                    </div>
                </Drawer>
                <Drawer
                    open={this.state.right}
                    onClose={this.toggleDrawer("right", false)}
                    anchor="right"
                >
                    <div
                        role="button"
                        onClick={this.toggleDrawer("right", false)}
                        onKeyDown={this.toggleDrawer("right", false)}
                    >
                        <MenuDerecha classes={classes} usuario={usuario} textoUsuario={textoUsuario} fotoUsuario={usuario.foto || Foto} salirSesion={this.cerrarSesionApp}></MenuDerecha>
                    </div>
                </Drawer>
                <Toolbar>
                    <IconButton color="inherit" onClick={this.toggleDrawer("left", true)}>
                        <i className="material-icons" >menu</i>
                    </IconButton>
                    <Typography variant="h5">SchoolDevelopers</Typography>
                    <div className={classes.grow}></div>
                    <div className={classes.sectionDesktop}>
                        <Button color="inherit" onClick={this.cerrarSesionApp}>
                            Salir
                        </Button>
                        <Button color="inherit">{textoUsuario}</Button>
                        <Avatar src={usuario.foto || Foto}></Avatar>
                    </div>
                    <div className={classes.sectionMovil}>
                        <IconButton color="inherit" onClick={this.toggleDrawer("right", true)}>
                            <i className="material-icons">more_vert</i>
                        </IconButton>
                    </div>
                </Toolbar>
            </Fragment>
        )
    }
}

export default compose(withRouter, consumerFirebase, withStyles(styles))(BarSesion);