import React, { Component } from 'react';
import { Button } from '@material-ui/core';


class ListaProblemas extends Component {
    render() {
        return (
            <div>
                <Button variant="contained" color="primary">Hola</Button>
                <Button variant="contained" color ="secondary">Adios</Button>
            </div>
        );
    }
}

export default ListaProblemas;