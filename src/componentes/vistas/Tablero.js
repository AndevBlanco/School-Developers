import React, { useRef } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { Grid, Button } from '@material-ui/core';
import styleForm from '../estilos/estiloForm';

function Tablero() {

    const primerDibujo = useRef(null);
    const segundoDibujo = useRef(null);
    const guardar = () => {
        const imagen = primerDibujo.current.getSaveData();
        console.log(imagen);
        segundoDibujo.current.loadSaveData(imagen, false);
    }
    const borrar = () => {
        primerDibujo.current.clear();
    }
    const volver = () => {
        primerDibujo.current.undo();
    }
    return (
        <div style={styleForm.paperTab}>
            <div style={styleForm.formU}>
                <Grid container spacing={2}>
                    <Grid item md={1} xs={1}>
                        <Button onClick={guardar} variant="contained" color="primary">Guardar</Button>
                    </Grid >
                    <Grid item md={1} xs={1}>
                        <Button onClick={borrar} variant="contained" color="primary" >Borrar</Button>
                    </Grid>

                    <Grid item md={1} xs={1}>
                        <Button onClick={volver} variant="contained" color="primary" >Volver</Button>
                    </Grid>
                    <Grid item md={1} xs={1}>
                        <Button onClick={volver} variant="contained" color="primary" >Subir</Button>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item md={6} xs={6}>
                        <CanvasDraw brushColor="#130f40" canvasHeight={"500px"} canvasWidth={"100%"} brushRadius={1} ref={primerDibujo} style={{ border: "2px solid black" }} />
                    </Grid>
                    <Grid item md={6} xs={6}>
                        <CanvasDraw ref={segundoDibujo} hideGrid="true" disabled="true" canvasHeight={"500px"} canvasWidth={"100%"} brushColor="#130f40" brushRadius={1} style={{ border: "2px solid black" }} />
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}


export default Tablero;