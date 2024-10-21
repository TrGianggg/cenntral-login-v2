<template>
  <div>
    <p class="text-gold-150">Hướng camera về phía mã QR</p>
    <div class="border-4 border-solid border-gold-150 relative">
      <QrStream
        @decode="onDecodeEmit"
        class="!w-full max-w-[300px] !aspect-square"
      />
      <div
        class="absolute top-0 w-full flex h-full"
        style="background: rgba(0, 0, 0, 0.3)"
      >
        <div class="anim-box spacer m-auto">
          <div></div>
          <div class="scanner"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { QrStream } from 'vue3-qr-reader'
import { reactive, ref, toRefs } from 'vue'

export default {
  name: 'ButtonScanQr',
  components: {
    QrStream
  },
  emits: ['gotNewScan', 'newScan'],
  setup(prop, { emit }) {
    const scanner_active = ref(true)
    const state = reactive({
      data: 'Scan QR'
    })
    const onDecode = (data) => {
      state.data = data
      console.log('son', state.data)
      emit('newScan', state.data)
    }

    const onDecodeEmit = (data) => {
      console.log(data)
      emit('gotNewScan', data)
      scanner_active.value = false
    }
    return {
      ...toRefs(state),
      scanner_active,
      onDecodeEmit,
      onDecode
    }
  }
}
</script>
