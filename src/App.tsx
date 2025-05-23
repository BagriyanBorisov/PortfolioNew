import { createGlobalStyle } from 'styled-components';
import Terminal from './components/Terminal';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Consolas', 'Courier New', monospace;
    background-color: #1e1e1e;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <Terminal />
    </>
  );
}

export default App;
