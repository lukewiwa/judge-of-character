import { createWorker, PSM } from "tesseract.js";
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

export { calcCanvasWidth, generateText, setupWorker };
