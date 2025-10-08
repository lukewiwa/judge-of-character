import { useEffect, useRef } from "react";
import SignaturePad, { type Options } from "signature_pad";

type ScribblePadProps = {
  onBeginStroke?: (e: Event, sp: SignaturePad) => void;
  onEndStroke?: (e: Event, sp: SignaturePad) => void;
  clear?: boolean;
  onClear?: () => void;
  signaturePadOptions?: Options;
} & React.CanvasHTMLAttributes<HTMLCanvasElement>;

const ScribblePad = ({
  onBeginStroke,
  onEndStroke,
  signaturePadOptions,
  clear = false,
  onClear,
  ...canvasProps
}: ScribblePadProps) => {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!(ref.current instanceof HTMLCanvasElement)) return;
    const signaturePad = new SignaturePad(ref.current, signaturePadOptions);
    if (clear) {
      signaturePad.clear();
      if (onClear) {
        onClear();
      }
    }
    signaturePad.addEventListener("beginStroke", (e) => {
      if (onBeginStroke) {
        onBeginStroke(e, signaturePad);
      }
    });
    signaturePad.addEventListener("endStroke", (e) => {
      if (onEndStroke) {
        onEndStroke(e, signaturePad);
      }
    });

    return () => {
      signaturePad.off();
    };
  }, [onBeginStroke, onEndStroke, signaturePadOptions, clear, onClear]);

  return <canvas ref={ref} {...canvasProps} />;
};

export default ScribblePad;
