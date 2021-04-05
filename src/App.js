import './App.css';
import Landing from './screens/Landing';
import defaultTheme from './styles/Themes';
import { ThemeProvider } from '@material-ui/core/styles';

function App() {
  return (
      <ThemeProvider theme={defaultTheme}>
        <div className="App">
            <Landing/>
        </div>
      </ThemeProvider>
  );
}

export default App;
