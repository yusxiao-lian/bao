// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import 'lib-flexible';
import router from './router';
import './service/axiosConfig.js';

Vue.config.productionTip = false;
import Toasty from './components/toast/';

Vue.use(Toasty);
import Loding from './components/loding';

Vue.use(Loding);
import QRcode from './components/QRcodeShare';

Vue.use(QRcode);

import inputCell from './components/inputCell';

Vue.use(inputCell);
import inputUpload from './components/inputUpload';

Vue.use(inputUpload);
import publicSlide from './components/publicSlide';

Vue.use(publicSlide);

import Mixin from './mixins/mixins.js';

Vue.mixin(Mixin);

Vue.prototype.toLogin = function (toGoURL) {
  window.localStorage.setItem('toGoURL', toGoURL || window.location.href);
  window.location.href = '/wechat/toLogin';
  // this.$createDialog({
  //   type: 'alert',
  //   title: '请先登陆',
  //   content: '',
  //   onConfirm: () => {
  //     window.location.href = '/wechat/toLogin';
  //   },
  // }).show();
};

import {
  // 基础样式
  Style,
  // basic
  Button,
  Loading,
  Tip,
  Toolbar,
  // form
  Checkbox,
  CheckboxGroup,
  Radio,
  Input,
  Textarea,
  Select,
  Switch,
  Rate,
  Validator,
  Upload,
  Form,
  // popup
  Popup,
  Toast,
  Picker,
  CascadePicker,
  DatePicker,
  TimePicker,
  SegmentPicker,
  Dialog,
  ActionSheet,
  Drawer,
  // scroll
  Scroll,
  Slide,
  IndexList,
  Swipe,
  TabBar,
  ImagePreview
} from 'cube-ui';

Vue.use(ActionSheet);
Vue.use(Drawer);
Vue.use(ImagePreview);
Vue.use(DatePicker);
Vue.use(TimePicker);
// Vue.use(Toolbar);
Vue.use(Slide);
Vue.use(Scroll);
Vue.use(TabBar);
Vue.use(Switch);
// Vue.use(Upload);
// Vue.use(CheckboxGroup);
Vue.use(Radio);
Vue.use(Select);
Vue.use(Dialog);
Vue.use(Toast);
Vue.use(Picker);
Vue.use(CascadePicker);
Vue.use(SegmentPicker);
Vue.use(Input);
Vue.use(Textarea);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Popup);
Vue.use(Button)

// Vue.use(Swipe)
import './style/base.scss';


import './directive/directive'
import VueLazyload from 'vue-lazyload'
import faileImg from "./assets/defultBg.png"

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: faileImg,
  loading: faileImg,
  attempt: 1
})
import store from './store'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>',
})
