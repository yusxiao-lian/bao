import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
import {
  getUserInfo
} from "@/service/personalMessage";

const entry = () => import("@/views/entry.vue");

const login = () => import("@/views/system/login.vue"); //注册
const passwordLogin = () => import("@/views/system/passwordLogin.vue"); //登录
const lookForPassword = () => import("@/views/system/lookForPassword.vue"); //找回密码
const lookForPassword2 = () => import("@/views/system/lookForPassword2.vue"); //修改密码
const personalMessage = () => import("@/views/system/personalMessage.vue"); //个人资料
const wuyePay = () => import("@/views/pay/wuyePay"); //物业缴费
const payHistoryList = () => import("@/views/pay/payHistoryList.vue"); //缴费记录列表
const prepay = () => import("@/views/pay/prepay.vue"); //预缴费用
const repairApply = () => import("@/views/repair/repairApply.vue"); //物业报修
const repairRecord = () => import("@/views/repair/repairRecord.vue"); //物业报修记录
const repairProgress = () => import("@/views/repair/repairProgress.vue"); //物业报修进度
const workEvaluate = () => import("@/views/repair/workEvaluate.vue"); //物业报修评价
// const parkingMonthPayment= ()=>import('@/components/pay/parkingMonthPayment.vue'); //停车月保缴费
const temporaryStopPaySettlementH5 = () =>
  import("@/views/pay/temporaryStopPaySettlementH5.vue"); //H5临停缴费-结算
const paymentCompletion = () => import("@/views/pay/paymentCompletion.vue"); //临停缴费-支付完成
const stopPayQueryH5 = () => import("@/views/pay/stopPayQueryH5.vue"); //H5临停缴费-查询
const createParkingQRCode = () => import("@/views/pay/createParkingQRCode.vue"); //生成H5临停缴费二维码
const setGateID = () => import("@/views/pay/setGateID.vue"); //设置通道扫码id
const toScanPay = () => import("@/views/pay/toScanPay.vue"); //通道扫码缴费
const toScanPayQRCode = () => import("@/views/pay/toScanPayQRCode.vue"); //生成通道扫码缴费二维码
const chooseCommunity = () => import("@/views/system/chooseCommunity.vue"); //选择社区
const HouseList = () => import("@/views/House/HouseList.vue"); //我的房屋
const addHouse = () => import("@/views/House/addHouse.vue"); //添加房屋
const roomData = () => import("@/views/House/roomData.vue"); //我的房屋确认身份
const rentSale = () => import("@/views/House/rentSale.vue"); //房屋租售
const rentSaleDetail = () => import("@/views/House/rentSaleDetail.vue"); //租售详情

const complaints = () => import("@/views/complaints"); //投诉建议
const addVehicle = () => import("@/views/vehicle/addVehicle.vue"); //添加车辆
const addaudit = () => import("@/views/vehicle/addaudit.vue"); //添加车辆审核
const myVehicle = () => import("@/views/vehicle/myVehicle.vue"); //我的车辆详情
const instructions = () => import("@/views/vehicle/instructions.vue"); //我的缴费记录
const results = () => import("@/views/vehicle/results.vue"); //支付结果
const payCost = () => import("@/views/vehicle/payCost.vue"); //月卡缴费
const agreement = () => import("@/views/vehicle/agreement.vue"); //停车场协议
const complaintsList = () => import("@/views/complaints/complaintsList.vue"); //投诉记录
const complaintDetails = () =>
  import("@/views/complaints/complaintDetails.vue"); //投诉详情
const entrance = () => import("@/views/entrance"); //我的门禁
const visitors = () => import("@/views/entrance/visitors.vue"); //访客邀请
const record = () => import("@/views/entrance/record.vue"); //邀请记录
const qrCode = () => import("@/views/entrance/qrCode.vue"); //二维码开门
const scanRes = () => import("@/views/entrance/openRes.vue"); //开门结果

// 临停缴费
const parking = () => import("@/views/parking"); //临停缴费入口
const indexitem = () => import("@/views/parking/indexitem.vue"); //临停缴费入口
const parkingPayCost = () => import("@/views/parking/payCost.vue"); //临停缴费
const parkingQueryCard = () => import("@/views/parking/queryCard.vue"); //缴费查询
const paymentinstructions = () =>
  import("@/views/parking/paymentinstructions.vue"); //缴费说明
const payResults = () => import("@/views/parking/payResults.vue"); //捷顺支付结果

const transferPage = () => import("@/views/transferPage.vue"); //中转页
const questionnaire = () => import("@/views/questionnaire/index.vue"); //问卷列表
const questionnaireDetails = () => import("@/views/questionnaire/details.vue"); //问卷详情

// 消息
const myMessage = () => import("@/views/message/myMessage.vue"); //消息列表
const parkMessage = () => import("@/views/message/parkMessage.vue");
const messageDetails = () => import("@/views/message/messageDetails.vue"); //消息详情
// 商户
const merchantsHome = () => import("@/views/merchants/merchantsHome.vue")
// const merchantsIndex = () => import("@/views/merchants/merchantsIndex.vue")
const merchantsList = () => import("@/views/merchants/merchantsList.vue")

// 联系管家
const housekeeper = () => import("@/views/housekeeper/index.vue") //管家列表
const chat = () => import("@/views/chat/index.vue") //管家聊天
// 通知公告
const announcementList = () => import("@/views/announcement/list.vue")
const announcementDetails = () => import("@/views/announcement/announcementDetails.vue")
// 能量值
const userPoint = () => import('@/views/system/userPoint.vue')
const pointRule = () => import('@/views/system/userPointRule.vue')
// 邻里
const relTopic = () => import('@/views/neighbor/relTopic.vue')
const topicList = () => import('@/views/neighbor/topicList.vue')
const topicDetail = () => import('@/views/neighbor/topicDetail.vue')
const myComment = () => import('@/views/neighbor/myComment.vue')
const myTopic = () => import('@/views/neighbor/myTopic.vue')
//工单
const createWork = () => import('@/views/work/createWork.vue') //新增工单
const assignWork = () => import('@/views/work/assignWork.vue') //分派工单
const orderReceiving = () => import('@/views/work/orderReceiving.vue') //接单
const workDispose = () => import('@/views/work/workDispose.vue') //工单处理
const completeReport = () => import('@/views/work/completeReport') //完工报告
const checkAccept = () => import('@/views/work/checkAccept') //工单验收
const AcceptanceToDetermine = () => import('@/views/work/AcceptanceToDetermine') //验收确定
const workReturnVisit = () => import('@/views/work/workReturnVisit') //工单回访
const returnVisitConfirm = () => import('@/views/work/returnVisitConfirm') //回访确定
const multiClass = () => import('@/views/work/multiClass') //多个类别
const myWork = () => import('@/views/work/myWork') //我的工单
const toDoTasks = () => import('@/views/work/toDoTasks') //待办事项
const selectWorker = () => import('@/views/work/selectWorker') //选择人员
const toAudit = () => import('@/views/work/toAudit') //待审核
const workList = () => import('@/views/work/workList') //工单池
const applicationMaterials = () => import('@/views/work/applicationMaterials') //工单池
const selectPosition = () => import('@/views/work/selectPosition') //位置选择


const router = new Router({
  routes: [{
      path: "/",
      redirect: "/login"
    },
    {
      path: "/entry",
      name: "entry",
      component: entry,
      meta: {
        keepAlive: true,
        title: "入口"
      }
    },
    {
      path: "/login",
      name: "login",
      component: login,
      meta: {
        keepAlive: true,
        title: "注册/登录"
      }
    },
    {
      path: "/passwordLogin",
      name: "passwordLogin",
      component: passwordLogin,
      meta: {
        keepAlive: true,
        title: "密码登录"
      }
    },
    {
      path: "/lookForPassword",
      name: "lookForPassword",
      component: lookForPassword,
      meta: {
        keepAlive: true,
        title: "找回密码"
      }
    },
    {
      path: "/lookForPassword2",
      name: "lookForPassword2",
      component: lookForPassword2,
      meta: {
        keepAlive: true,
        title: "修改密码"
      }
    },
    {
      path: "/personalMessage",
      name: "personalMessage",
      component: personalMessage,
      meta: {
        keepAlive: false,
        title: "个人资料"
      }
    },
    {
      path: "/userPoint",
      name: "userPoint",
      component: userPoint,
      meta: {
        keepAlive: false,
        title: "能量值"
      }
    },
    {
      path: "/pointRule",
      name: "pointRule",
      component: pointRule,
      meta: {
        keepAlive: false,
        title: "规则"
      }
    },
    {
      path: "/wuyePay",
      name: "wuyePay",
      component: wuyePay,
      meta: {
        keepAlive: true,
        title: "物业缴费"
      }
    },
    {
      path: "/payHistoryList",
      name: "payHistoryList",
      component: payHistoryList,
      meta: {
        keepAlive: true,
        title: "我的缴费"
      }
    },
    {
      path: "/prepay",
      name: "prepay",
      component: prepay,
      meta: {
        keepAlive: true,
        title: "预缴费用"
      }
    },
    {
      path: "/rentSale",
      name: "rentSale",
      component: rentSale,
      meta: {
        keepAlive: true,
        title: "房屋租售"
      }
    },
    {
      path: "/rentSaleDetail",
      name: "rentSaleDetail",
      component: rentSaleDetail,
      meta: {
        keepAlive: true,
        title: "租售详情"
      }
    },
    {
      path: "/repairApply",
      name: "repairApply",
      component: repairApply,
      meta: {
        keepAlive: true,
        title: "物业报修"
      }
    },
    {
      path: "/repairRecord",
      name: "repairRecord",
      component: repairRecord,
      meta: {
        keepAlive: true,
        title: "我的报修"
      }
    },
    {
      path: "/repairProgress",
      name: "repairProgress",
      component: repairProgress,
      meta: {
        keepAlive: true,
        title: "物业报修进度"
      }
    },
    {
      path: "/workEvaluate",
      name: "workEvaluate",
      component: workEvaluate,
      meta: {
        keepAlive: true,
        title: "评价"
      }
    },
    // {path:'/parkingMonthPayment',name:'parkingMonthPayment',component:parkingMonthPayment,meta:{keeplive:true,title:'停车月保缴费'}},
    {
      path: "/temporaryStopPaySettlementH5",
      name: "temporaryStopPaySettlementH5",
      component: temporaryStopPaySettlementH5,
      meta: {
        keeplive: true,
        title: "H5临停缴费-结算"
      }
    },
    {
      path: "/paymentCompletion",
      name: "paymentCompletion",
      component: paymentCompletion,
      meta: {
        keeplive: true,
        title: "临停缴费-支付完成"
      }
    },
    {
      path: "/stopPayQueryH5",
      name: "stopPayQueryH5",
      component: stopPayQueryH5,
      meta: {
        keeplive: true,
        title: "H5临停缴费-查询"
      }
    },
    {
      path: "/createParkingQRCode",
      name: "createParkingQRCode",
      component: createParkingQRCode,
      meta: {
        keeplive: true,
        title: "生成H5临停缴费二维码"
      }
    },
    {
      path: "/setGateID",
      name: "setGateID",
      component: setGateID,
      meta: {
        keeplive: true,
        title: ""
      }
    },
    {
      path: "/toScanPay",
      name: "toScanPay",
      component: toScanPay,
      meta: {
        keeplive: true,
        title: "通道扫码缴费"
      }
    },
    {
      path: "/toScanPayQRCode",
      name: "toScanPayQRCode",
      component: toScanPayQRCode,
      meta: {
        keeplive: true,
        title: "生成通道扫码缴费二维码"
      }
    },
    {
      path: "/chooseCommunity",
      name: "chooseCommunity",
      component: chooseCommunity,
      meta: {
        keeplive: false,
        title: "选择社区"
      }
    },
    {
      path: "/HouseList",
      name: "HouseList",
      component: HouseList,
      meta: {
        keeplive: true,
        title: "我的房屋"
      }
    },
    {
      path: "/addHouse/:type",
      name: "addHouse",
      component: addHouse,
      meta: {
        keeplive: true,
        title: "添加房屋"
      }
    },
    {
      path: "/roomData",
      name: "roomData",
      component: roomData,
      meta: {
        keeplive: true,
        title: "身份认证"
      }
    },
    {
      path: "/complaints",
      name: "complaints",
      component: complaints,
      meta: {
        keeplive: true,
        title: "投诉建议"
      }
    },
    {
      path: "/complaintsList",
      name: "complaintsList",
      component: complaintsList,
      meta: {
        keeplive: true,
        title: "投诉记录"
      }
    },
    {
      path: "/complaintDetails",
      name: "complaintDetails",
      component: complaintDetails,
      meta: {
        keeplive: true,
        title: "处理进度"
      }
    },
    {
      path: "/addVehicle",
      name: "addVehicle",
      component: addVehicle,
      meta: {
        keeplive: true,
        title: "添加车辆"
      }
    },
    {
      path: "/addaudit",
      name: "addaudit",
      component: addaudit,
      meta: {
        keeplive: true,
        title: "添加车辆"
      }
    },
    {
      path: "/myVehicle",
      name: "myVehicle",
      component: myVehicle,
      meta: {
        keeplive: true,
        title: "我的车辆"
      }
    },
    {
      path: "/agreement",
      name: "agreement",
      component: agreement,
      meta: {
        keeplive: true,
        title: "停车场协议"
      }
    },
    {
      path: "/payCost",
      name: "payCost",
      component: payCost,
      meta: {
        keeplive: true,
        title: "月卡缴费"
      }
    },
    {
      path: "/entrance",
      name: "entrance",
      component: entrance,
      meta: {
        keeplive: true,
        title: "我的门禁"
      }
    },
    {
      path: "/record",
      name: "record",
      component: record,
      meta: {
        keeplive: true,
        title: "邀请记录"
      }
    },
    {
      path: "/visitors",
      name: "visitors",
      component: visitors,
      meta: {
        keeplive: true,
        title: "访客邀请"
      }
    },
    {
      path: "/qrCode",
      name: "qrCode",
      component: qrCode,
      meta: {
        keeplive: true,
        title: "二维码开门"
      }
    },

    {
      path: "/scanRes",
      name: "scanRes",
      component: scanRes,
      meta: {
        keeplive: true,
        title: "我的门禁"
      }
    },
    {
      path: "/transferPage",
      name: "transferPage",
      component: transferPage,
      meta: {
        keeplive: true,
        title: ""
      }
    },
    // 问卷
    {
      path: "/questionnaire",
      name: "questionnaire",
      component: questionnaire,
      meta: {
        keeplive: true,
        title: "问卷列表"
      }
    },
    {
      path: "/questionnaireDetails",
      name: "questionnaireDetails",
      component: questionnaireDetails,
      meta: {
        keeplive: true,
        title: "问卷详情"
      }
    },
    // 临停缴费
    {
      path: "/parking",
      name: "parking",
      component: parking,
      meta: {
        keeplive: true,
        title: ""
      }
    },
    {
      path: "/indexitem",
      name: "indexitem",
      component: indexitem,
      meta: {
        keeplive: true,
        title: "缴费查询"
      }
    },
    {
      path: "/parkingPayCost",
      name: "parkingPayCost",
      component: parkingPayCost,
      meta: {
        keeplive: true,
        title: "停车缴费"
      }
    },
    {
      path: "/parkingQueryCard",
      name: "parkingQueryCard",
      component: parkingQueryCard,
      meta: {
        keeplive: true,
        title: "缴费查询"
      }
    },
    {
      path: "/instructions",
      name: "instructions",
      component: instructions,
      meta: {
        keeplive: true,
        title: "缴费记录"
      }
    },
    {
      path: "/paymentinstructions",
      name: "paymentinstructions",
      component: paymentinstructions,
      meta: {
        keeplive: true,
        title: "缴费说明"
      }
    },
    {
      path: "/results",
      name: "results",
      component: results,
      meta: {
        keeplive: true,
        title: "支付结果"
      }
    }, //月卡停车场结果
    {
      path: "/payResults",
      name: "payResults",
      component: payResults,
      meta: {
        keeplive: true,
        title: "支付结果"
      } //捷顺停车场结果
    },
    // 消息模块
    {
      path: "/myMessage",
      name: "myMessage",
      component: myMessage,
      meta: {
        keeplive: true,
        title: "我的消息"
      } //捷顺停车场结果
    },
    {
      path: "/parkMessage",
      name: "parkMessage",
      component: parkMessage,
      meta: {
        keeplive: true,
        title: "消息列表"
      } //捷顺停车场结果
    },
    {
      path: "/messageDetails",
      name: "messageDetails",
      component: messageDetails,
      meta: {
        keeplive: true,
        title: "消息详情"
      } //捷顺停车场结果
    },
    // 商户相关
    {
      path: "/merchantsHome",
      name: "merchantsHome",
      component: merchantsHome,
      meta: {
        keeplive: false,
        title: ""
      } //商户首页
    },
    // {
    //   path: "/merchantsIndex",
    //   name: "merchantsIndex",
    //   component: merchantsIndex,
    //   meta: { keeplive: false, title: "E+社区" } //商户首页
    // },
    {
      path: "/merchantsList",
      name: "merchantsList",
      component: merchantsList,
      meta: {
        keeplive: false,
        title: "推荐"
      } //更多商户
    },
    // 联系管家
    {
      path: "/housekeeper",
      name: "housekeeper",
      component: housekeeper,
      meta: {
        keeplive: false,
        title: "便民信息"
      } //更多商户
    },
    // 通知公告
    {
      path: "/announcementList",
      name: "announcementList",
      component: announcementList,
      meta: {
        keeplive: false,
        title: "通知公告"
      }
    },
    {
      path: "/announcementDetails",
      name: "announcementDetails",
      component: announcementDetails,
      meta: {
        keeplive: false,
        title: "通知详情"
      }
    },
    // 在线聊天
    {
      path: "/chat",
      name: "chat",
      component: chat,
      meta: {
        keeplive: false,
        title: "在线聊天"
      }
    },
    //邻里
    {
      path: "/relTopic",
      name: "relTopic",
      component: relTopic,
      meta: {
        keeplive: false,
        title: "发布话题"
      }
    },
    {
      path: "/topicList",
      name: "topicList",
      component: topicList,
      meta: {
        keeplive: false,
        title: "话题列表"
      }
    },
    {
      path: "/topicDetail",
      name: "topicDetail",
      component: topicDetail,
      meta: {
        keeplive: false,
        title: "话题详情"
      }
    },
    {
      path: "/myComment",
      name: "myComment",
      component: myComment,
      meta: {
        keeplive: false,
        title: "我的评论"
      }
    },
    {
      path: "/myTopic",
      name: "myTopic",
      component: myTopic,
      meta: {
        keeplive: false,
        title: "我的话题"
      }
    },
    // 工单
    {
      path: "/createWork",
      name: "createWork",
      component: createWork,
      meta: {
        keeplive: false,
        title: "新增工单"
      }
    },
    {
      path: "/assignWork",
      name: "assignWork",
      component: assignWork,
      meta: {
        keeplive: false,
        title: "分派工单"
      }
    },
    {
      path: "/orderReceiving",
      name: "orderReceiving",
      component: orderReceiving,
      meta: {
        keeplive: false,
        title: "接单"
      }
    },
    {
      path: "/workDispose",
      name: "workDispose",
      component: workDispose,
      meta: {
        keeplive: false,
        title: "工单处理"
      }
    },
    {
      path: "/completeReport",
      name: "completeReport",
      component: completeReport,
      meta: {
        keeplive: false,
        title: "完工报告"
      }
    },
    {
      path: "/checkAccept",
      name: "checkAccept",
      component: checkAccept,
      meta: {
        keeplive: false,
        title: "工单验收"
      }
    },
    {
      path: "/AcceptanceToDetermine",
      name: "AcceptanceToDetermine",
      component: AcceptanceToDetermine,
      meta: {
        keeplive: false,
        title: "验收确定"
      }
    },
    {
      path: "/workReturnVisit",
      name: "workReturnVisit",
      component: workReturnVisit,
      meta: {
        keeplive: false,
        title: "分派工单" //工单回访
      }
    },
    {
      path: "/returnVisitConfirm",
      name: "returnVisitConfirm",
      component: returnVisitConfirm,
      meta: {
        keeplive: false,
        title: "工单回访" //回访确定
      }
    },
    {
      path: "/multiClass",
      name: "multiClass",
      component: multiClass,
      meta: {
        keeplive: false,
        title: "分派工单" //多个类别 
      }
    },
    {
      path: "/myWork",
      name: "myWork",
      component: myWork,
      meta: {
        keeplive: false,
        title: "我的工单 " //我的工单 
      }
    },
    {
      path: "/toDoTasks",
      name: "toDoTasks",
      component: toDoTasks,
      meta: {
        keeplive: false,
        title: "待办事项 " //待办事项 
      }
    },
    {
      path: "/selectWorker",
      name: "selectWorker",
      component: selectWorker,
      meta: {
        keeplive: false,
        title: "选择人员 " //选择人员 
      }
    },
    {
      path: "/applicationMaterials",
      name: "applicationMaterials",
      component:applicationMaterials,
      meta: {
        keeplive: false,
        title: "申请物料 " //申请物料 
      }
    },
    {
      path: "/toAudit",
      name: "toAudit",
      component:toAudit,
      meta: {
        keeplive: false,
        title: "待审核 " //待审核 
      }
    },
    {
      path: "/workList",
      name: "workList",
      component: workList,
      meta: {
        keeplive: false,
        title: "工单池 " //工单池 
      }
    },
    {
      path: "/selectPosition",
      name: "selectPosition",
      component: selectPosition,
      meta: {
        keeplive: false,
        title: "位置选择 " //位置选择 
      }
    },
  ]
});
//路由鉴权白名单
let whiteUrl = [
  "lookForPassword2",
  "lookForPassword",
  "passwordLogin",
  "login"
];
router.beforeEach(async (to, from, next) => {
  let userInfo = JSON.parse(window.localStorage.getItem("userInfo")) || {};

  if (to.query.accessToken || to.query["Access-Token"]) {
    if (userInfo) {
      userInfo.accessToken = to.query.accessToken || to.query["Access-Token"];
      userInfo.communityId = to.query.communityId;
      userInfo.houseId = to.query.houseId;
      window.localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
  }

  if (userInfo.accessToken) {
    if (userInfo && typeof userInfo.authFlag == "undefined") {
      let res = await getUserInfo({
        communityId: userInfo.communityId
      });
      if (res && res.error) {
        if ("0" == res.error.err_code) {
          userInfo = Object.assign(userInfo, res.obj);
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
          res.obj.communitys.forEach(v => {
            if (v === userInfo.communityId) {
              userInfo.authFlag = true;
              localStorage.setItem("userInfo", JSON.stringify(userInfo));
            }
          });
        }
      }
    }
  } else {

  }
  next();
});

router.afterEach((to, from, next) => {
  document.title = to.meta.title;
});
Router.prototype.goBack = function (num) {
  this.isBack = true; //用来判断页面切换的过渡动画方向
  window.history.go(num || -1);
};
export default router;
