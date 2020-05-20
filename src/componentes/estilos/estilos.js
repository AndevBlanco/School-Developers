

const styles = theme=>({
    sectionDesktop:{
        display:"none",
        [theme.breakpoints.up("md")]:{
            display:"flex"
        }
    },
    grow:{
        flexGrow:1
    },sectionMovil:{
        display:"flex",
        [theme.breakpoints.up("md")]:{
            display:"none"
        }
    }
})
export default styles;