<template>
  <div>
    <div class="p-4 space-y-4">
      <UserStats />
      <div>
        <p class="text-blue-700">Draw these letters</p>
        <p class="text-5xl text-blue-800 py-3">{{ generatedText }}</p>
      </div>
      <span class="text-blue-700">on the pad below ✏️</span>
      <canvas
        ref="canvas"
        class="bg-white border border-blue-300 rounded"
        height="200"
        :width="canvasWidth"
      ></canvas>
      <TextWrangle :judged-text="judgedText" />
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
import TextWrangle from "@/components/TextWrangle.vue";
import UserStats from "@/components/UserStats.vue";
import { calcCanvasWidth, generateText, setupWorker } from "@/assets/js/utils";
import {
  getLevel,
  setLevel,
  setPoints,
  decrementAttempts,
  getAttempts,
  resetAttempts,
} from "@/assets/js/state";

export default defineComponent({
  name: "Home",
  components: { TextWrangle, UserStats },
  setup(_, { root }) {
    // setup tesseract worker
    const worker = setupWorker();

    const generatedText = ref("");
    generatedText.value = generateText(getLevel.value);

    // Setup judge
    const judgedText = ref("");
    let timeout: any;
    const judgeCharacter = async (canvas: HTMLCanvasElement) => {
      const {
        data: { text },
      } = await worker.recognize(canvas);
      judgedText.value = `${text}`.replace(/\s+/g, "");
      if (
        judgedText.value.toLowerCase() === generatedText.value.toLowerCase()
      ) {
        setLevel(getLevel.value + 1);
        generatedText.value = generateText(getLevel.value);
        setPoints();
        resetAttempts();
      } else {
        decrementAttempts();
        if (getAttempts.value <= 0) {
          root.$router.push({ name: "Fail" });
        }
      }
      signaturePad.clear();
    };

    const judgeAfterWait = (canvas: HTMLCanvasElement) => {
      timeout = setTimeout(async () => {
        await judgeCharacter(canvas);
      }, 700);
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

    return {
      judgedText,
      canvas,
      canvasWidth,
      generatedText,
    };
  },
});
</script>
