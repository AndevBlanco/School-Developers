export const openMensajePantalla=(dispatch,openMensaje)=>{
    dispatch({
        type:"OPEN_SNACKBAR",
        openMensaje:openMensaje,
    })
    console.log(openMensaje.mensaje)
}