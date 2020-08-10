<template>
  <div class="container mx-auto flex flex-col items-center">
    <h1 class="text-3xl font-medium text-blue-700 my-6">
      Judge of Character 👨‍⚖️
    </h1>
    <div class="p-4 space-y-4">
      <span class="text-blue-700">Draw letters on the pad below ✏️</span>
      <canvas
        ref="canvas"
        class="bg-white border border-blue-300 rounded"
        height="200"
        :width="canvasWidth"
      ></canvas>
      <TextWrangle :judged-text="judgedText" @transform-text="transformText" />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  Ref,
  onUnmounted,
} from "@vue/composition-api";
import SignaturePad from "signature_pad";
import { createWorker } from "tesseract.js";
import TextWrangle from "@/components/TextWrangle.vue";
import { calcCanvasWidth } from "@/assets/js/utils";

export default defineComponent({
  components: { TextWrangle },
  setup() {
    // Setup judge
    const judgedText = ref("");
    let timeout: any;
    const judgeCharacter = async (canvas: HTMLCanvasElement) => {
      const {
        data: { text },
      } = await worker.recognize(canvas);
      judgedText.value = `${judgedText.value}${text}`.replace(/\s+/g, "");
      signaturePad.clear();
    };
    const judgeAfterWait = (canvas: HTMLCanvasElement) => {
      timeout = setTimeout(async () => await judgeCharacter(canvas), 650);
    };

    // setup text transform
    const transformText = (transform: string) => {
      if (transform === "upper") {
        judgedText.value = judgedText.value.toUpperCase();
      }
      if (transform === "lower") {
        judgedText.value = judgedText.value.toLowerCase();
      }
      if (transform === "clear") {
        judgedText.value = "";
      }
    };

    // setup signature pad
    const canvas: Ref<HTMLCanvasElement | null> = ref(null);
    let signaturePad: SignaturePad;
    const canvasWidth = ref(calcCanvasWidth());
    const resizeCanvas = () => {
      canvasWidth.value = calcCanvasWidth();
    };
    onMounted(() => {
      if (canvas.value instanceof HTMLCanvasElement) {
        signaturePad = new SignaturePad(canvas.value, {
          minWidth: 2,
          onEnd: () => {
            if (canvas.value instanceof HTMLCanvasElement) {
              judgeAfterWait(canvas.value);
            }
          },
          onBegin: () => {
            clearTimeout(timeout);
          },
        });
        window.addEventListener("resize", resizeCanvas);
      }
    });
    onUnmounted(() => {
      window.removeEventListener("resize", resizeCanvas);
    });

    // setup tesseract worker
    const worker = createWorker();
    (async () => {
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      await worker.setParameters({
        tessedit_char_whitelist:
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890",
      });
    })();

    return {
      judgedText,
      canvas,
      canvasWidth,
      transformText,
    };
  },
});
</script>
