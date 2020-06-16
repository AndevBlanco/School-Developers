import React, { Fragment, useEffect } from 'react';
import './App.css';
import ButtonAppBar from './componentes/plantilla/Barra';
import ListaProblemas from './componentes/vistas/ListaProblemas';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import theme from "./theme/teme";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import RegistrarEstudiante from './componentes/seguridad/RegistrarEstudiante';
import Inicio from './componentes/vistas/Inicio';
import Login from './componentes/seguridad/Login';
import { FirebaseContext } from "./server";
import { useStateValue } from "./sesion/store";
import { Snackbar } from '@material-ui/core';
import Tablero from './componentes/vistas/Tablero';
import RegistrarProfesor from './componentes/seguridad/RegistrarProfesor';
import RutaAutenticada from './componentes/seguridad/RutaAutenticada';
import PerfilUsuario from './componentes/seguridad/PerfilUsuario';
import NuevoProblema from './componentes/vistas/NuevoProblema';
import EditarProblema from './componentes/vistas/editarProblema';
import LoginTelefono from './componentes/seguridad/LoginTelefono';
import ListaProblemasPublicos from './componentes/vistas/ListaProblemasPublicos';
import DetallesProblema from './componentes/vistas/DetallesProblema';


function App(props) {
  let Firebase = React.useContext(FirebaseContext);
  const [autenticacionIniciada, setupFirebaseInitial] = React.useState(false);         //creando una variable de tipo estado autenticacionIniciada con valor false

  const [{ openSnackbar }, dispatch] = useStateValue();// llamandoo reducer de opensnackbar

  useEffect(() => {
    Firebase.estaIniciado().then(val => {
      setupFirebaseInitial(val);
    });
  });

  return autenticacionIniciada !== false ? (
    <Fragment>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={openSnackbar ? openSnackbar.open : false}
        autoHideDuration={3000}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={
          <span id="message-id">
            {openSnackbar ? openSnackbar.mensaje : ""}
          </span>
        }
        onClose={() =>
          dispatch({
            type: "OPEN_SNACKBAR",
            openMensaje: {
              open: false,
              mensaje: ""
            }
          })
        }
      >
      </Snackbar>
      <Router>
        <Fragment>
          <MuiThemeProvider theme={theme}>
            <ButtonAppBar />
            <br></br>
            <Switch>
              <Route path="/" exact component={Login} />
              <Route path="/auth/telefono"  component={LoginTelefono} />
              <Route path="/auth/profesor"  component={RegistrarProfesor} />
              <Route path="/auth/estudiante" component={RegistrarEstudiante} />
              <RutaAutenticada  path="/Inicio/detalles/:id" autenticadoFirebase={Firebase.auth.currentUser} component={DetallesProblema} />
              <Route path="/Inicio/tablero"  component={Tablero} />
              <RutaAutenticada  path="/Inicio/Listadeproblemas" autenticadoFirebase={Firebase.auth.currentUser} component={ListaProblemas} />
              <RutaAutenticada  path="/solucionar/editar/:id" autenticadoFirebase={Firebase.auth.currentUser} component={Tablero} />
              <Route path="/Inicio"  component={Inicio} />
              <RutaAutenticada  path="/editar/perfil" autenticadoFirebase={Firebase.auth.currentUser} component={PerfilUsuario} />
              <RutaAutenticada  path="/editar/problema/:id" autenticadoFirebase={Firebase.auth.currentUser} component={EditarProblema} />
              <RutaAutenticada  path="/problemas/publicos" autenticadoFirebase={Firebase.auth.currentUser} component={ListaProblemasPublicos} />
              <RutaAutenticada  path="/problema" autenticadoFirebase={Firebase.auth.currentUser} component={NuevoProblema} />
            </Switch>
          </MuiThemeProvider>
        </Fragment>
      </Router>
    </Fragment>
  )
    : null
    ;
}

export default App;
