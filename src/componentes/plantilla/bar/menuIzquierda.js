import React from "react"
import { List, ListItem, ListItemText, Divider } from "@material-ui/core"
import { Link } from "react-router-dom"

export const MenuIzquierda = ({ classes }) => (
    <div className={classes.list}>
        <List>
            <ListItem component={Link} button to="/Inicio" >
                <i className="material-icons">business</i>
                <ListItemText classes={{ primary: classes.ListItemText }} primary="Inicio"></ListItemText>
            </ListItem>
        </List>
        <Divider />
        <List>
            <ListItem component={Link} button to="/editar/perfil">
                <i className="material-icons">account_box</i>
                <ListItemText classes={{ primary: classes.ListItemText }} primary="Perfil"></ListItemText>
            </ListItem>
        </List>
        <Divider />
        <List>
            <ListItem component={Link} button to="/problema" >
                <i className="material-icons">add_box</i>
                <ListItemText classes={{ primary: classes.ListItemText }} primary="Subir Problema"></ListItemText>
            </ListItem>
        </List>  
        <Divider />
        <List>
            <ListItem component={Link} button to="/Inicio/ListadeProblemas" >
                <i className="material-icons">business</i>
                <ListItemText classes={{ primary: classes.ListItemText }} primary="Mis Problemas"></ListItemText>
            </ListItem>
        </List>
        <Divider />
        <List>
            <ListItem component={Link} button to="/problemas/publicos" >
                <i className="material-icons">business</i>
                <ListItemText classes={{ primary: classes.ListItemText }} primary="Problemas Publicados"></ListItemText>
            </ListItem>
        </List>
        <Divider />
        <List>
            <ListItem component={Link} button to="/Inicio/tablero" >
                <i className="material-icons">aspect_ratio</i>
                <ListItemText classes={{ primary: classes.ListItemText }} primary="Tablero"></ListItemText>
            </ListItem>
        </List>
        <Divider />

    </div >
)