import { mount } from 'svelte'
import './styles/pico.css'
import './styles/custom.css'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app'),
})

export default app
