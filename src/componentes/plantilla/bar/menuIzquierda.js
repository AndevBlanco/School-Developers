import React from "react"
import { List, ListItem, ListItemText, Divider } from "@material-ui/core"
import { Link } from "react-router-dom"

export const MenuIzquierda = ({ classes }) => (
    <div className={classes.list}>
        <List>
            <ListItem component={Link} button to="/" >
                <i className="material-icons">business</i>
                <ListItemText classes={{ primary: classes.ListItemText }} primary="Inicio"></ListItemText>
            </ListItem>
        </List>
        <List>
            <ListItem component={Link} button to="">
                <i className="material-icons">account_box</i>
                <ListItemText classes={{ primary: classes.ListItemText }} primary="Perfil"></ListItemText>
            </ListItem>
        </List>
        <Divider />
        <List>
            <ListItem component={Link} button to="" >
                <i className="material-icons">add_box</i>
                <ListItemText classes={{ primary: classes.ListItemText }} primary="Subir Problema"></ListItemText>
            </ListItem>
        </List>  
        <List>
            <ListItem component={Link} button to="/ListaProblemas" >
                <i className="material-icons">business</i>
                <ListItemText classes={{ primary: classes.ListItemText }} primary="Problemas"></ListItemText>
            </ListItem>
        </List>
        <List>
            <ListItem component={Link} button to="" >
                <i className="material-icons">mail_outline</i>
                <ListItemText classes={{ primary: classes.ListItemText }} primary="Mensajes"></ListItemText>
            </ListItem>
        </List>
        <List>
            <ListItem component={Link} button to="/Tablero" >
                <i className="material-icons">aspect_ratio</i>
                <ListItemText classes={{ primary: classes.ListItemText }} primary="Tablero"></ListItemText>
            </ListItem>
        </List>

    </div >
)