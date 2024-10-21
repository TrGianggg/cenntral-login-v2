<template>
  <div class="comp-detect-qr">
    <IconQrCode
      class="text-gold-150"
      @click="() => (openConfirm = !openConfirm)"
    ></IconQrCode>
    <a-modal
      centered
      v-model:visible="openConfirm"
      wrapClassName="modal-transfer-tomxu"
    >
      <div class="flex flex-col items-center justify-between mt-6">
        <div class="flex flex-col gap-2 items-center text-body-1 text-neutral-400">
          <div>
            <p class="text-gold-150">{{ $t('tomxu.qr_scanner_title') }}</p>
            <div class="border-4 border-solid border-gold-150 relative">
              <QrStream
                v-if="openConfirm"
                @decode="onDecode"
                class="!w-full max-w-[300px] !aspect-square"
              />
              <div class="absolute top-0 w-full flex h-full">
                <div class="anim-box spacer m-auto">
                  <div></div>
                  <div class="scanner"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script setup>
import { QrStream } from 'vue3-qr-reader'
import { ref, defineEmits } from 'vue'
import IconQrCode from '@/components/shared/icons/IconQrCode.vue'

const emit = defineEmits(['getQrCode'])
const openConfirm = ref(false)
const onDecode = (data) => {
  emit('getQrCode', data)
  openConfirm.value = false
}
</script>
<style>
.center {
  margin: 0 auto;
  text-align: center;
}

/* barcode container */
.anim-box {
  position: relative;
  width: 80%;
  height: 80%;
  padding: 25px 30px;
  transition: transform 0.6s ease-out;
}

/* adds the 4 corners */
.anim-box:before,
.anim-box:after,
.anim-box > :first-child:before,
.anim-box > :first-child:after {
  position: absolute;
  width: 20%;
  height: 20%;
  border-color: #e8d6a1;
  border-style: solid;
  content: ' ';
}

/* top left corner */
.anim-box:before {
  top: 0;
  left: 0;
  border-width: 4px 0 0 4px;
}

/* top right corner */
.anim-box:after {
  top: 0;
  right: 0;
  border-width: 4px 4px 0 0;
}

/* bottom right corner */
.anim-box > :first-child:before {
  bottom: 0;
  right: 0;
  border-width: 0 4px 4px 0;
}

/* bottom left corner */
.anim-box > :first-child:after {
  bottom: 0;
  left: 0;
  border-width: 0 0 4px 4px;
}

/* barcode bars */

/* grow on hover */

/* animated laser beam */
.scanner {
  width: 100%;
  height: 3px;
  background-color: #e8d6a1;
  opacity: 0.7;
  position: relative;
  box-shadow: 0px 0px 8px 10px rgba(232, 214, 161, 0.49);
  animation-name: scan;
  animation-duration: 4s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-play-state: running;
}

@keyframes scan {
  0% {
    box-shadow: 0px 0px 8px 10px rgba(232, 214, 161, 0.49);
    top: 2%;
  }
  25% {
    box-shadow: 0px 6px 8px 10px rgba(232, 214, 161, 0.49);
    top: 50%;
  }
  50% {
    box-shadow: 0px -6px 8px 10px rgba(232, 214, 161, 0.49);
    top: 98%;
  }
  70% {
    box-shadow: 0px 6px 8px 10px rgba(232, 214, 161, 0.49);
    top: 50%;
  }
  100% {
    box-shadow: 0px 0px 8px 10px rgba(232, 214, 161, 0.49);
    top: 2%;
  }
}
</style>
