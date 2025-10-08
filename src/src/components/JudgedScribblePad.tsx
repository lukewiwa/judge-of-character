import { useState } from "react";
import ScribblePad from "./ScribblePad";
import { useDebounceCallback } from "usehooks-ts";
import { useOcr } from "../hooks/Ocr";
import type SignaturePad from "signature_pad";

type JudgedScribblePadProps = {
  onJudge: (judgedText: string | null) => void;
};

const JudgedScribblePad = ({ onJudge }: JudgedScribblePadProps) => {
  const recognizeText = useOcr();

  const [clearScribble, setClearScribble] = useState(false);

  const onEndStroke = useDebounceCallback(async (sp: SignaturePad) => {
    const recognizedText = await recognizeText(sp.toDataURL());
    setClearScribble(true);
    onJudge(recognizedText?.trim() ?? null);
  }, 800);

  return (
    <ScribblePad
      width={500}
      height={200}
      signaturePadOptions={{ penColor: "blue", minWidth: 1 }}
      className="bg-white border border-blue-300 rounded"
      clear={clearScribble}
      onClear={() => {
        setClearScribble(false);
      }}
      onBeginStroke={() => {
        onEndStroke.cancel();
      }}
      onEndStroke={async (_, sp) => {
        await onEndStroke(sp);
      }}
    />
  );
};

export default JudgedScribblePad;
