import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
import { getQueryString } from "../unit/unit";

const state = {
  confirmationOrderData: null, //订单数据
  staffFlag: null, //是否是员工
  bgColor: getQueryString("bgColor") ? "#" + getQueryString("bgColor") : "",
  receivingAddress: null,
  activeHouse: null,
  activeHouseObj: {},
  parkInfo: null,
  isCustomer: getQueryString("isCustomer") || "",
  phone: "",
  cityName: "",
  wxJsSdkFlag: false
};

const mutations = {
  setConfirmationOrderData(state, data) {
    state.confirmationOrderData = data;
  },
  setStaffFlag(state, data) {
    state.staffFlag = data;
  },
  setReceivingAddress(state, data) {
    state.receivingAddress = data;
  },
  setActiveHouse(state, data) {
    state.activeHouse = data;
  },
  setActiveHouseObj(state, data) {
    state.activeHouseObj = data;
  },
  setParkInfo(state, data) {
    state.parkInfo = data;
  },
  setCity(state, data) {
    state.cityName = data;
  },
  setWxJsSdkFlag(state, wxJsSdkFlag) {
    state.wxJsSdkFlag = wxJsSdkFlag;
  }
};

const actions = {
  setConfirmationOrderData: ({ commit }, data) =>
    commit("setConfirmationOrderData", data),
  setStaffFlag: ({ commit }, data) => commit("setStaffFlag", data),
  setReceivingAddress: ({ commit }, data) =>
    commit("setReceivingAddress", data),
  setActiveHouse: ({ commit }, data) => commit("setActiveHouse", data),
  setActiveHouseObj: ({ commit }, data) => commit("setActiveHouseObj", data),
  setParkInfo: ({ commit }, data) => commit("setParkInfo", data),
  setCity: ({ commit }, data) => commit("setCity", data),
  setWxJsSdkFlag: ({ commit }, wxJsSdkFlag) =>
    commit("setWxJsSdkFlag", wxJsSdkFlag),
};

// getters are functions
const getters = {
  getConfirmationOrderData: state => state.confirmationOrderData
};

export default new Vuex.Store({
  strict: false,
  state,
  getters,
  actions,
  mutations
});
