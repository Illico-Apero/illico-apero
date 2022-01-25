import { createMuiTheme } from '@material-ui/core/styles';
import amber from '@material-ui/core/colors/amber';

const defaultTheme = createMuiTheme
({
    palette: {
        primary: {
            main: '#e94d1a'
        },
        secondary: amber
    },
    overrides: {
        MuiButton: {
            label: {
                color:'#fff'
            }
        }
    }
});

export default defaultTheme;