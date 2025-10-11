import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type PropsWithChildren,
} from "react";
import { allowableCharacters } from "../constants";

type GameState = {
  level: number;
  points: number;
  attempts: number;
  requiredText: string | null;
};

const generateText = (length: number) =>
  new Array(length)
    .fill(0)
    .map(() => {
      const index = Math.floor(Math.random() * allowableCharacters.length);
      return allowableCharacters[index];
    })
    .join("");

const maxAttempts = 5;
const initialState = (): GameState => {
  const requiredText = generateText(1);
  return {
    level: 1,
    points: 0,
    attempts: maxAttempts,
    requiredText,
  };
};

type ResetAction = { type: "RESET" };
type PassAction = { type: "PASS" };
type FailAction = { type: "FAIL" };

type Actions = ResetAction | PassAction | FailAction;

const reducer = (state: GameState, action: Actions) => {
  switch (action.type) {
    case "RESET":
      return initialState();
    case "PASS": {
      const { level, points, attempts } = state;
      const updatedPoints = level * attempts + points;
      const updatedLevel = level + 1;
      const requiredText = generateText(updatedLevel);
      return {
        level: level + 1,
        points: updatedPoints,
        attempts: maxAttempts,
        requiredText,
      };
    }
    case "FAIL": {
      const { attempts, requiredText } = state;
      const decrementedAttempts = attempts - 1;
      const updatedRequiredText = decrementedAttempts > 0 ? requiredText : null;
      return {
        ...state,
        attempts: decrementedAttempts,
        requiredText: updatedRequiredText,
      };
    }

    default:
      return state;
  }
};

const GameStateContext = createContext<[GameState, Dispatch<Actions>] | null>(
  null
);

export const GameStateContextProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, null, initialState);

  return (
    <GameStateContext.Provider value={[state, dispatch]}>
      {children}
    </GameStateContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === null) throw new Error("Error establishing state");
  return context;
};
