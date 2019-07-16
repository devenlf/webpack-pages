import Vue from "vue";
import Page2 from "./index.vue";

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  render: h => h(Page2),
}).$mount("#page2");