import Game from "./components/Game";
import { OcrContextProvider } from "./components/Ocr";

const App = () => {
  return (
    <OcrContextProvider>
      <h1>Judge of Character</h1>
      <div>
        <Game />
      </div>
    </OcrContextProvider>
  );
};

export default App;
