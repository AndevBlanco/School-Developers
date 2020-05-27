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
              <Route path="/" exact component={Login}/>
              <Route path="/Telefono"  component={LoginTelefono} />
              <Route path="/Inicio"  component={Inicio} />
              <Route path="/Tablero" component={Tablero} />
              <Route path="/Registrarse" component={RegistrarEstudiante} />
              <Route path="/RegistrarseProfesor" component={RegistrarProfesor} />
              <RutaAutenticada  path="/ListaProblemas" autenticadoFirebase={Firebase.auth.currentUser} component={ListaProblemas} />
              <RutaAutenticada  path="/Perfil" autenticadoFirebase={Firebase.auth.currentUser} component={PerfilUsuario} />
              <RutaAutenticada  path="/Problema" autenticadoFirebase={Firebase.auth.currentUser} component={NuevoProblema} />
              <RutaAutenticada  path="/Problema/:id" autenticadoFirebase={Firebase.auth.currentUser} component={EditarProblema} />
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
