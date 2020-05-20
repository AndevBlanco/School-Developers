import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import estilosInicio from '../estilos/estilosInicio';


export default function Inicio() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container >
        <Typography component="div" style={estilosInicio.banner} />
      </Container>
    </React.Fragment>
  );
}
