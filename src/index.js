import Vue from 'vue'
import App from './app.vue'
import './assets/styles/global.styl'

const root = document.createElement('div')
document.body.appendChild(root)



new Vue({
    render: (h) => h(App) //h参数就是vue中的createApp这个参数
}).$mount(root)//将vue实例对象挂载到root这个html节点上


