import React from 'react';
import estilos from "./estilos.css"
import { Grid} from '@material-ui/core';

export default function Inicio() {
  return (
    <React.Fragment>
        <div className="banner"></div>
        <Grid container spacing={10}>
          <Grid item md={4}>

          </Grid>
          <Grid item md={4}>

          </Grid>
          <Grid item md={4}>

          </Grid>
        </Grid>
    </React.Fragment>
  );
}
