<template>
  <div class="details">
    <headerTab :title="$route.meta.title"/>

    <div class="survey-detail">
      <div class="survey-detail-content">
        <div class="survey-detail-tips">
          <div>为了给您提供更好的服务，希望您能抽出几分钟时间，将您的感受和建议告诉我们，我们非常重视每位用户的宝贵意见，期待您的参与！现在我们就马上开始吧！</div>
        </div>
        <div class="survey-detail-content-group">
          <!--1.问题-->
          <div class="survey-detail-content-group-option question" data-type="radio">
            <div class="survey-detail-content-group-option-title">1.问题</div>
            <div class="survey-detail-content-group-option-control clear answer">

              <label>
                <input type="radio" class="survey-detail-content-group-option-result"
                       name="0be8a66c894e4e54b39fba28a77c8a21">
                <span>选项</span>
              </label>

              <label>
                <input type="radio" class="survey-detail-content-group-option-result"
                       name="0be8a66c894e4e54b39fba28a77c8a21">
                <span>选项</span>
              </label>

            </div>
          </div>
          <!--2.问题-->
          <div class="survey-detail-content-group-option question" data-type="checkbox">
            <div class="survey-detail-content-group-option-title">2.问题</div>
            <div class="survey-detail-content-group-option-control clear answer">
              <label>
                <input type="checkbox" class="survey-detail-content-group-option-result">
                <span>选项</span>
              </label>

              <label>
                <input type="checkbox" class="survey-detail-content-group-option-result">
                <span>选项</span>
              </label>

            </div>
          </div>
          <!--3.问题-->
          <div class="survey-detail-content-group-option question">
            <div class="survey-detail-content-group-option-title">
              <p>3.问题</p>
              <textarea class="survey-detail-content-result-comment answer" maxlength="200"></textarea>
            </div>
          </div>
          <!--4.问题-->
          <div class="survey-detail-content-group-option question">
            <div class="survey-detail-content-group-option-title">4.问题</div>
            <div class="survey-detail-content-group-option-control clear answer">

              <label>
                <input type="radio" class="survey-detail-content-group-option-result"
                       name="18994566a0634a10868ae27dcfbb44a6">
                <span>1</span>
              </label>

              <label>
                <input type="radio" class="survey-detail-content-group-option-result"
                       name="18994566a0634a10868ae27dcfbb44a6">
                <span>2</span>
              </label>

              <label>
                <input type="radio" class="survey-detail-content-group-option-result"
                       name="18994566a0634a10868ae27dcfbb44a6">
                <span>3</span>
              </label>

              <label>
                <input type="radio" class="survey-detail-content-group-option-result"
                       name="18994566a0634a10868ae27dcfbb44a6">
                <span>4</span>
              </label>

              <label>
                <input type="radio" class="survey-detail-content-group-option-result"
                       name="18994566a0634a10868ae27dcfbb44a6">
                <span>5</span>
              </label>

            </div>
          </div>
          <!--5.问题-->
          <div class="survey-detail-content-group-option question" data-id="2a0731ab4e8148b2b9b71d25a8b0b316"
               data-type="number" data-idx="5" data-must="true">
            <div class="survey-detail-content-group-option-title">5.问题</div>
            <div>

              您的评分是 <input type="number" class="survey-detail-content-group-option-point answer" min="0" max="100">
              分(0~100分)
            </div>
          </div>
          <!--6.问题-->
          <div class="survey-detail-content-group-option question" data-id="abbfaa7595bc45bf836e1d77f06eda83"
               data-type="matrixRadio" data-idx="6" data-must="true">
            <div class="survey-detail-content-group-option-title">6.问题</div>

            <div class="survey-detail-content-group-option-controlTitle">6.1&nbsp;子问题</div>
            <div class="survey-detail-content-group-option-control clear answer">

              <label><input type="radio" class="survey-detail-content-group-option-result"
                            name="a7326f5202a548a8ad9a0fc81dc3a719"><span>非常不同意</span></label>

              <label><input type="radio" class="survey-detail-content-group-option-result"
                            name="a7326f5202a548a8ad9a0fc81dc3a719"><span>同意</span></label>

              <label><input type="radio" class="survey-detail-content-group-option-result"
                            name="a7326f5202a548a8ad9a0fc81dc3a719"><span>不确定</span></label>

              <label><input type="radio" class="survey-detail-content-group-option-result"
                            name="a7326f5202a548a8ad9a0fc81dc3a719"><span>不同意</span></label>

              <label><input type="radio" class="survey-detail-content-group-option-result"
                            name="a7326f5202a548a8ad9a0fc81dc3a719"><span>非常同意</span></label>

            </div>

            <div class="survey-detail-content-group-option-controlTitle">6.2&nbsp;子问题</div>
            <div class="survey-detail-content-group-option-control clear answer">

              <label><input type="radio" class="survey-detail-content-group-option-result"
                            data-id="908564dcf2e84432a19e49da47fc9143" data-score="1"
                            name="d535ef605d1b4b98b87376c4e489df03"><span>非常不同意</span></label>

              <label><input type="radio" class="survey-detail-content-group-option-result"
                            data-id="9f4011f1a84d4f6f886de04e99b4977a" data-score="4"
                            name="d535ef605d1b4b98b87376c4e489df03"><span>同意</span></label>

              <label><input type="radio" class="survey-detail-content-group-option-result"
                            data-id="a018288d815e4c27ad838f3ed0822f78" data-score="3"
                            name="d535ef605d1b4b98b87376c4e489df03"><span>不确定</span></label>

              <label><input type="radio" class="survey-detail-content-group-option-result"
                            data-id="bd4b181a805b425ab04c9ad9569836b2" data-score="2"
                            name="d535ef605d1b4b98b87376c4e489df03"><span>不同意</span></label>

              <label><input type="radio" class="survey-detail-content-group-option-result"
                            data-id="ee5bfb75afb140de85da44a0cd4b9230" data-score="5"
                            name="d535ef605d1b4b98b87376c4e489df03"><span>非常同意</span></label>

            </div>

          </div>
          <!--7.问题-->
          <div class="survey-detail-content-group-option question" data-id="1a3d1332e90446a68be39b3ecf9288b9"
               data-type="matrixNumber" data-idx="7" data-must="true">
            <div class="survey-detail-content-group-option-title">7.问题</div>

            <div class="survey-detail-content-group-option-controlTitle">7.1&nbsp;子问题</div>
            <div class="survey-detail-content-group-option-control-sub clear">
              <div>

                您的评分是 <input type="number" class="survey-detail-content-group-option-point answer"
                             data-subq="352263a44b014280b15d9bc7ab040dc1" min="0" max="100">
                分(0~100分)
              </div>
            </div>

            <div class="survey-detail-content-group-option-controlTitle">7.2&nbsp;子问题</div>
            <div class="survey-detail-content-group-option-control-sub clear">
              <div>

                您的评分是 <input type="number" class="survey-detail-content-group-option-point answer"
                             data-subq="3f6714e2090842a3bdd1960a49809845" min="0" max="100">
                分(0~100分)
              </div>
            </div>

          </div>
          <!--8.问题-->
          <div class="survey-detail-content-group-option question" data-id="9fe999fed51942b6bf40555439fca731"
               data-type="matrixText" data-idx="8" data-must="true">
            <div class="survey-detail-content-group-option-title">8.问题</div>

            <div class="survey-detail-content-group-option-controlTitle">
              <p>8.1&nbsp;子问题</p>
              <textarea data-subq="54430772217d416699cf47c760a20e99" class="survey-detail-content-result-comment answer"
                        maxlength="200"></textarea>
            </div>

            <div class="survey-detail-content-group-option-controlTitle">
              <p>8.2&nbsp;子问题</p>
              <textarea data-subq="7e5afb8bf27a4d07bf45285fbee01210" class="survey-detail-content-result-comment answer"
                        maxlength="200"></textarea>
            </div>

          </div>
          <!--9.问题-->
          <div class="survey-detail-content-group-option" data-id="4124d7b271eb45adb9b780240b3e9497" data-type="mixture"
               data-idx="9" data-must="true">
            <div class="survey-detail-content-group-option-title">9.问题</div>


            <div class="survey-detail-content-group-option-controlTitle">9.1&nbsp;问题</div>
            <div class="survey-detail-content-group-option-control-sub clear question"
                 data-id="3fcf78284dbd42c193008af4bf3172e2" data-type="number" data-must="true" data-idx="9.1">
              <div>

                您的评分是 <input type="number" class="survey-detail-content-group-option-point answer"
                             data-subq="3fcf78284dbd42c193008af4bf3172e2" min="0" max="100">
                分(0~100分)
              </div>
            </div>


            <div class="survey-detail-content-group-option-controlTitle">
              9.2&nbsp;问题
            </div>
            <div class="survey-detail-content-group-option-control clear answer question"
                 data-id="6e9e34a8d10a4d4ca4963c3f87374cb1" data-type="checkbox" data-must="true" min="" max=""
                 data-idx="9.2">

              <label><input type="checkbox" class="survey-detail-content-group-option-result"
                            data-id="164d261f5e50482ebdeee168c3d62ff1" data-score="0"
                            name="6e9e34a8d10a4d4ca4963c3f87374cb1"><span>选项</span></label>

              <label><input type="checkbox" class="survey-detail-content-group-option-result"
                            data-id="97def7db8d2d4aa89a8664add211cdbe" data-score="0"
                            name="6e9e34a8d10a4d4ca4963c3f87374cb1"><span>选项</span></label>

            </div>


            <div class="survey-detail-content-group-option-controlTitle question"
                 data-id="74024fe17e804be8bc5af41e8e81a435" data-type="text" data-must="true" data-idx="9.3">
              <p>9.3&nbsp;问题</p>
              <textarea data-subq="74024fe17e804be8bc5af41e8e81a435" class="survey-detail-content-result-comment answer"
                        maxlength="200"></textarea>
            </div>


            <div class="survey-detail-content-group-option-controlTitle">
              9.4&nbsp;问题
            </div>
            <div class="survey-detail-content-group-option-control clear answer question"
                 data-id="decfa651f88848fb8bfa26ef547001d4" data-type="radio" data-must="true" data-idx="9.4">

              <label><input type="radio" class="survey-detail-content-group-option-result"
                            data-id="33f900b4e13e4ca391752f3910f877c9" data-score="0"
                            name="decfa651f88848fb8bfa26ef547001d4"><span>选项</span></label>

              <label><input type="radio" class="survey-detail-content-group-option-result"
                            data-id="f2d2eb1682ba4698aa6611415f751891" data-score="0"
                            name="decfa651f88848fb8bfa26ef547001d4"><span>选项</span></label>

            </div>


          </div>


          <div class="survey-detail-content-group-option">
            <div class="survey-detail-content-result-submit-bg">
              <!-- <button type="button" class="survey-detail-content-result-submit" >提交</button> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {headerTab} from "../../components/index";

  export default {
    name: "",
    components: {
      headerTab
    },
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .details {
    padding-top: 100px;
  }

  .survey-detail {
    padding: 19px 23px;
  }

  .survey-detail-content {
    background-color: #fff;
    border-top: 8px solid #008dd2;
    border-radius: 10px;
  }

  .survey-detail-tips {
    background-color: #e9f8ff;
    color: #004b71;
    text-align: left;
    font-size: 26px;
    line-height: 48px;
    padding: 20px 0;
    div{
      padding: 0 10px;
    }
  }

  .survey-detail-content-group-option {
    font-size: 28px;
    color: #666;
    padding: 37.5px 20px;
  }

  .survey-detail-content-group-option:nth-of-type(n+2) {
    border-top: 1Px solid #eeeeee;
  }

  .survey-detail-content-group-option-title {
    font-size: 30px;
    color: #333;
    font-weight: 600;
    padding-bottom: 30px;
  }

  .survey-detail-content-group-option-point {
    height: 60px;
    width: 195px;
    border: 1Px solid #e2e2e2;
    border-radius: 10px;
    text-align: center;
  }

  .survey-detail-content-group-option-control * {
    float: left;
    line-height: 44px;
  }

  .survey-detail-content-group-option-control-sub {
    line-height: 44px;
  }

  .survey-detail-content-group-option-control label {
    margin: 20px 0;
    margin-right: 12px;
    min-width: 200px;
  }

  .survey-detail-content-group-option-result {
    -webkit-appearance: none;
    width: 44px;
    height: 44px;
    background-color: #f0f0f0;
    border-radius: 44px;
    float: left;
    border: 1Px solid #dfdfdf;
    margin-right: 15px;
  }

  .survey-detail-content-group-option-result:checked {
    border: none;
    background: url("../../assets/img/survey-success.png") no-repeat center;
    background-size: 100% 100%;
  }

  .survey-detail-content-result {
    background-color: #fff3e9;
    font-size: 30px;
    padding: 37.5px 50px;
  }

  .survey-detail-content-result-point {
    height: 60px;
    width: 195px;
    border: 1Px solid #e2e2e2;
    border-radius: 10px;
    text-align: center;
  }

  .survey-detail-content-result-comment {
    /* width: 6px; */
    width: 100%;
    height: 235px;
    border-radius: 10px;
    resize: none;
    margin-top: 37.5px;
    border: 1Px solid #e2e2e2;
    padding: 15px;
  }

  .survey-detail-content-result-submit-bg, .survey-detail-content-result-comment-bg {
    margin-top: 46px;
  }

  .survey-detail-content-result-submit.save {
    background-color: #ed6d00;
  }

  .survey-detail-content-result-submit {
    width: 49%;
    height: 90px;
    border: none;
    background-color: #ed6d00;
    color: #fff;
    font-size: 32px;
    font-family: "Glyphicons Halflings", "Helvetica Neue", Helvetica, Microsoft Yahei, Hiragino Sans GB, WenQuanYi Micro Hei, sans-serif;
    border-radius: 30px;
  }

  .survey-detail-content-group-option-controlTitle {
    padding-top: 30px;
    padding-bottom: 20px;
  }

  .survey-detail-content-group-option-result[type='checkbox'] {
    border-radius: 10px;
  }

  .survey-detail-content-group-option-result:checked {
    border: none;
    background: url("../../assets/img/survey-success.png") no-repeat center;
    background-size: 120% 120%;
  }

  .survey-cover {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .75);
    z-index: 2;
  }

  .survey-cover-main {
    position: absolute;
    width: 400px;
    height: 260px;
    text-align: center;
    background-color: #fff;
    font-size: 28px;
    border-radius: 10px;
    top: 50%;
    left: 50%;
    margin-left: -200px;
    margin-top: -130px;
    padding: 40px 0;
  }

  .survey-cover-content {
    line-height: 100px;
  }

  .cover-btn-group {
    padding-top: 30px;
  }

  .cover-btn-group button {
    width: 150px;
    height: 50px;
    border: none;
    background-color: #ed6d00;
    color: #fff;
    font-size: 24px;
  }

  .clear:after {
    content: '';
    clear: both;
    display: block;
  }
</style>
