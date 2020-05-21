

const styles = theme => ({
    sectionDesktop: {
        display: "none",
        [theme.breakpoints.up("md")]: {
            display: "flex"
        }
    },
    grow: {
        flexGrow: 1
    }, sectionMovil: {
        display: "flex",
        [theme.breakpoints.up("md")]: {
            display: "none"
        }
    },
    avatarSize: {
        width: 40,
        heigth: 40
    },
    listItemText: {
        fontSize: "14px",
        fontWeigth: 600,
        paddingLeft: "15px",
        color: "#212121"
    },
    list:{
        width:250

    }
})
export default styles;