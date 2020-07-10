<template>
  <div class="container mx-auto flex flex-col items-center">
    <h1 class="text-3xl font-medium text-blue-700 my-6">
      Judge of Character 👨‍⚖️
    </h1>
    <div class="p-4 space-y-4">
      <span class="text-blue-700">Draw letters on the pad below ✏️</span>
      <canvas
        ref="scribble"
        class="bg-white border border-blue-300 rounded"
        height="200"
        :width="canvasWidth"
      ></canvas>
      <TextWrangle :judged-text="judgedText" @transform-text="transformText" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SignaturePad from "signature_pad";
import { createWorker } from "tesseract.js";
import TextWrangle from "@/components/TextWrangle.vue";
import { calcCanvasWidth } from "@/assets/js/utils";

export default Vue.extend({
  components: { TextWrangle },
  data() {
    const worker = createWorker();
    return {
      signaturePad: null as SignaturePad | null,
      judgedText: "",
      canvasWidth: calcCanvasWidth(),
      worker,
      timeout: null as any,
    };
  },
  async created() {
    await this.worker.load();
    await this.worker.loadLanguage("eng");
    await this.worker.initialize("eng");
    await this.worker.setParameters({
      tessedit_char_whitelist:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890",
    });
  },
  mounted() {
    const canvas = this.$refs.scribble as HTMLCanvasElement;
    this.signaturePad = new SignaturePad(canvas, {
      minWidth: 2,
      onEnd: () => {
        this.judgeAfterWait(canvas);
      },
      onBegin: () => {
        clearTimeout(this.timeout);
      },
    });
    window.addEventListener("resize", this.resizeCanvas);
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeCanvas);
  },
  methods: {
    judgeAfterWait(canvas: HTMLCanvasElement) {
      this.timeout = setTimeout(
        async () => await this.judgeCharacter(canvas),
        650
      );
    },
    async judgeCharacter(canvas: HTMLCanvasElement) {
      const {
        data: { text },
      } = await this.worker.recognize(canvas);
      this.judgedText = `${this.judgedText}${text}`.replace(/\s+/g, "");
      if (this.signaturePad) {
        this.signaturePad.clear();
      }
    },
    resizeCanvas() {
      this.canvasWidth = calcCanvasWidth();
    },
    transformText(transform: string) {
      if (transform === "upper") {
        this.judgedText = this.judgedText.toUpperCase();
      }
      if (transform === "lower") {
        this.judgedText = this.judgedText.toLowerCase();
      }
      if (transform === "clear") {
        this.judgedText = "";
      }
    },
  },
});
</script>
