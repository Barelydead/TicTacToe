import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

import { io } from "socket.io-client";

const socket = io();

createApp(App).mount('#app')