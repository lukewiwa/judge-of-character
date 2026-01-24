import About from "./components/About";
import Game from "./components/Game";
import { GameStateContextProvider } from "./hooks/GameState";
import { OcrContextProvider } from "./hooks/Ocr";

const App = () => {
  return (
    <GameStateContextProvider>
      <OcrContextProvider>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Judge of Character 👨‍⚖️</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#63b3ed" />
        <div className="container mx-auto flex flex-col items-center text-blue-800">
          <h1 className="text-3xl font-medium text-blue-700 my-6">
            Judge of Character 👨‍⚖️
          </h1>
          <Game />
          <About />
        </div>
      </OcrContextProvider>
    </GameStateContextProvider>
  );
};

export default App;
