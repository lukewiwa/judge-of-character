import SignatureCanvas from "react-signature-canvas";
import { useCallback, useRef, useState } from "react";
import { useOcr } from "./Ocr";
import { useTimeout } from "usehooks-ts";

const Game = () => {
  const ref = useRef<SignatureCanvas | null>(null);
  const getRef = useCallback(() => {
    if (ref.current === null) throw new Error("");
    return ref.current;
  }, []);

  const [scribble, setScribble] = useState<string>("");
  const [ocrScribble, setOcrScribble] = useState("");

  const [ocrTimeout, setOcrTimeout] = useState<number | null>(null);
  const setScribbleAferTimeout = () => {
    setOcrScribble(scribble);
  };
  useTimeout(setScribbleAferTimeout, ocrTimeout);

  const recognizedText = useOcr(ocrScribble);
  return (
    <>
      <button
        onClick={() => {
          const scribbleCanvas = getRef();
          scribbleCanvas.clear();
          setScribble("");
          setOcrScribble("");
        }}
      >
        Clear
      </button>
      <SignatureCanvas
        ref={ref}
        penColor="blue"
        canvasProps={{
          width: 500,
          height: 200,
          className: "border-2 border-indigo-500",
        }}
        onBegin={() => {
          setOcrTimeout(null);
        }}
        onEnd={() => {
          const scribbleCanvas = getRef();
          setScribble(scribbleCanvas.toDataURL());
          setOcrTimeout(800);
        }}
      />
      <p>{recognizedText}</p>
    </>
  );
};

export default Game;
