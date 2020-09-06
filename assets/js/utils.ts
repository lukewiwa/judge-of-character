import { createWorker, PSM } from "tesseract.js";
import SignaturePad from "signature_pad";
import { allowableCharacters } from "@/assets/js/constants";

const calcCanvasWidth = () => Math.min(window.screen.availWidth - 20, 520);

const generateText = (length: number): string => {
  return new Array(length)
    .fill(0)
    .map(() => {
      const index = Math.floor(Math.random() * allowableCharacters.length);
      return allowableCharacters[index];
    })
    .join("");
};

const setupWorker = () => {
  // setup tesseract worker
  const worker = createWorker();
  (async () => {
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    await worker.setParameters({
      tessedit_char_whitelist: allowableCharacters,
      tessedit_pageseg_mode: PSM.SINGLE_WORD,
    });
  })();
  return worker;
};

const judgeCharacter = async ({
  canvas,
  signaturePad,
  worker,
}: {
  canvas: HTMLCanvasElement;
  signaturePad: SignaturePad;
  worker: Tesseract.Worker;
}) => {
  signaturePad.off();
  const {
    data: { text },
  } = await worker.recognize(canvas);
  signaturePad.clear();
  signaturePad.on();
  return text.replace(/\s+/g, "");
};

const createSignaturePad = (canvas: HTMLCanvasElement) => {
  return new SignaturePad(canvas, {
    minWidth: 2.5,
    maxWidth: 3.5,
  });
};

export {
  calcCanvasWidth,
  generateText,
  setupWorker,
  judgeCharacter,
  createSignaturePad,
};
