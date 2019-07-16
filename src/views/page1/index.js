import Vue from "vue";
import Page1 from "./index.vue";

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  render: h => h(Page1),
}).$mount("#page1");