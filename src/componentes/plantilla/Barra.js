import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import BarSesion from './bar/BarSesion';
export default function ButtonAppBar() {
  return (
    <AppBar position="static" color="primary">
      <BarSesion></BarSesion>
    </AppBar>

  );
}
