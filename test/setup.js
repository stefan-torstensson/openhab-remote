require("reflect-metadata");
require('jsdom-global')();
const Vue = require("vue");

// Disable Vue development console warnings
Vue.config.devtools = false;
Vue.config.productionTip  = false;

// Fix for https://github.com/vuejs/vue-test-utils/issues/936
window.Date = Date;
