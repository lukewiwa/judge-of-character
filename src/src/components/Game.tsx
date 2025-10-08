import { useState } from "react";
import { useGameState } from "../hooks/GameState";
import JudgedScribblePad from "./JudgedScribblePad";

const Game = () => {
  const [state, dispatch] = useGameState();

  const [recognizedText, setRecognizedText] = useState<string | null>(null);

  return (
    <div className="flex flex-col space-y-4">
      <div>
        <p>Level: {state.level}</p>
        <p>Points: {state.points}</p>
        <p>Attempts: {state.attempts}</p>
      </div>
      {state.attempts > 0 ? (
        <>
          <div>
            <p className="text-blue-700">Draw these letters</p>
            <p className="text-5xl text-blue-800 border border-blue-300 rounded mb-3 py-1">
              <span key={`${state.level}${state.attempts}`} className="mx-4">
                {state.requiredText}
              </span>
            </p>
          </div>
          <div className="flex flex-col space-y-4">
            <span className="text-blue-700">on the pad below ✏️</span>
            <JudgedScribblePad
              onJudge={(judgedText) => {
                setRecognizedText(judgedText);
                if (
                  judgedText?.toLowerCase() ===
                  state.requiredText?.toLowerCase()
                ) {
                  dispatch({ type: "PASS" });
                } else {
                  dispatch({ type: "FAIL" });
                }
              }}
            />
          </div>
          <div className="flex flex-col space-y-4 w-full items-start">
            <span className="text-blue-700">This is what you wrote</span>
            <span className="bg-gray-100 border border-blue-300 rounded py-2 px-4 h-14 text-3xl w-full">
              {recognizedText}
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col space-y-4">
            <span className="text-3xl text-red-600">You Failed</span>
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                dispatch({ type: "RESET" });
                setRecognizedText(null);
              }}
            >
              Start Again
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Game;
