import 'vitest-canvas-mock'
import { setActivePinia, createPinia } from 'pinia'

// Ensure Pinia is set up before each test
beforeEach(() => {
  const pinia = createPinia()
  setActivePinia(pinia)
})
