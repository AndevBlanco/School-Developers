import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
    typography: {
        useNextVariants: true
    },
    palette: {
        primary: {
            main: "rgba(0, 41, 90, 0.945)"
        },
        common: {
            white: "white"
        },
        secondary: {
            main: "#f50057"
        }
    },
    spacing: 10
})
export default theme;