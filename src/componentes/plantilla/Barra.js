import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import BarSesion from './bar/BarSesion';
import { withStyles } from "@material-ui/styles";
import { compose } from "recompose";
import { consumerFirebase } from "../../server";
import { StateContext } from "../../sesion/store";
const styles = theme => ({
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  sectionMovil: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  }

})

class ButtonAppBar extends React.Component {
  static contextType = StateContext;

  state = {
    Firebase: null
  }
  componentDidMount() {
    const { Firebase } = this.state; //local state
    const [{ sesion }, dispatch] = this.context;//global state
    if (Firebase.auth.currentUser !== null && !sesion) {
      Firebase.db
        .collection("Usuarios")
        .doc(Firebase.auth.currentUser.uid)
        .get()
        .then(doc => {
          const usuarioDB = doc.data();
          dispatch({
            type: "INICIAR_SESION",
            sesion: usuarioDB,
            autenticado: true
          })
        })
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    let nuevosObjetos = {};
    if (nextProps.Firebase !== prevState.Firebase) {
      nuevosObjetos.Firebase = nextProps.Firebase
    }
    return nuevosObjetos;
  }
  render() {
    const [{ sesion }, dispatch] = this.context;

    return sesion ? (sesion.autenticado ? (
      <div>
        <AppBar position="static" color="primary">
          <BarSesion></BarSesion>
        </AppBar>
      </div>
    )
    : null
    )
  : null;
  }
}
export default compose(withStyles(styles), consumerFirebase)(ButtonAppBar);
