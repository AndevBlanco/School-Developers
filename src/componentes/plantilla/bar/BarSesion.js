import React, { Component } from 'react';
import { Toolbar, Typography, Button, IconButton } from '@material-ui/core';
import {withStyles} from "@material-ui/core/styles";
import styles from '../../estilos/estilos';

class BarSesion extends Component {
    render() {
        const{classes} =this.props;
        return (
        
                <Toolbar>
                    <IconButton color="inherit">
                        <i className="material-icons" >menu</i>
                    </IconButton>
                    <Typography variant="h5"> SchoolDevelopers</Typography>
                    <div className={classes.grow}></div>
                    <div className={classes.sectionDesktop}>
                        <Button color="inherit">Login</Button>
                    </div>
                    <div className={classes.sectionMovil}>
                        <IconButton color="inherit">
                            <i className="material-icons">more_vert</i>
                        </IconButton>
                    </div>
                </Toolbar>
        );
    }
}

export default withStyles(styles)(BarSesion);