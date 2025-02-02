import Vue from 'vue'
import TuniaoUI from '@/uni_modules/tuniao-ui'
Vue.use(TuniaoUI)

import uView from '@/uni_modules/uview-ui'
Vue.use(uView)
import App from './App'
import store from './store/index.js'
Vue.prototype.$store = store

import API from './utils/api.js'
import Net from './utils/net.js'
Vue.prototype.$API = API
Vue.prototype.$Net = Net

import metas from './pages/components/metas.vue'
Vue.component('metas',metas)

import articleItem from './pages/components/articleItem.vue'
Vue.component('articleItem',articleItem)

import commentItem from './pages/components/commentItem.vue'
Vue.component('commentItem',commentItem)

import spaceItem from './pages/components/spaceItem.vue'
Vue.component('spaceItem',spaceItem)
import followItem from './pages/components/followItem.vue'
Vue.component('followItem',followItem)

Vue.config.productionTip = false

App.mpType = 'app'
const app = new Vue({
	store,
    ...App
})
app.$mount()

 



