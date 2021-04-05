import { createMuiTheme } from '@material-ui/core/styles';
import amber from '@material-ui/core/colors/amber';
import orange from '@material-ui/core/colors/orange';

const defaultTheme = createMuiTheme({
    palette: {
        primary: amber,
        secondary: orange,
    },
});

export default defaultTheme;