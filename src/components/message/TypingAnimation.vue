<template>
  <div class='typing'>
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<style scoped>
@keyframes jump {
  25% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-0.25em);
  }

  75% {
    transform: translateY(0);
  }
}

.typing {
  display: inline-flex;
  height: 0.5rem;
  width: min-content;
  align-items: flex-end;
}

.typing span {
  width: 0.25em;
  height: 0.25em;
  border-radius: 50%;
  margin: 0 0.1em;
  background: #CBB472;
  animation: jump 1200ms infinite;
}

.typing span:nth-child(2) {
  animation-delay: 250ms;
}

.typing span:nth-child(3) {
  animation-delay: 500ms;
}
</style>