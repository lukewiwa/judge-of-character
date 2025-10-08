import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type PropsWithChildren,
} from "react";
import Tesseract, { type ImageLike } from "tesseract.js";
import { allowableCharacters } from "../constants";

const OcrContext = createContext<{
  getWorker: () => Promise<Tesseract.Worker>;
} | null>(null);

export const OcrContextProvider = ({ children }: PropsWithChildren) => {
  const workerRef = useRef<Tesseract.Worker | null>(null);
  const workerPromiseRef = useRef<Promise<Tesseract.Worker> | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const workerPromise = Tesseract.createWorker("eng");
        workerPromiseRef.current = workerPromise;
        const worker = await workerPromise;
        worker.setParameters({
          tessedit_char_whitelist: allowableCharacters,
        });
        workerRef.current = worker;
      } catch (error) {
        console.error("Failed to initialize Tesseract worker:", error);
        throw error;
      }
    })();

    return () => {
      workerRef.current
        ?.terminate()
        .then((r) => {
          console.log("Cleaned up worker: ", r);
        })
        .catch((error) => {
          // You might see this if the worker was already terminated,
          // but it prevents an unhandled promise warning.
          console.warn("Error during worker termination:", error);
        });
    };
  }, []);

  const getWorker = async () => {
    if (workerPromiseRef.current === null) throw new Error("");
    return await workerPromiseRef.current;
  };
  return (
    <OcrContext.Provider value={{ getWorker }}>{children}</OcrContext.Provider>
  );
};

export const useOcr = () => {
  const context = useContext(OcrContext);
  if (context === null) throw new Error("Could not determine OCR context");

  const { getWorker } = context;

  const recognizeText = async (image: ImageLike) => {
    try {
      const worker = await getWorker();
      const {
        data: { text },
      } = await worker.recognize(image);
      return text;
    } catch (error) {
      console.warn(error);
      return null;
    }
  };

  return recognizeText;
};
