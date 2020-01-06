<template>
  <div class="readPane" :class="showTool?'':'hideHead'" @click="showCata = false">
    <mt-popup v-model="popupVisible" popup-transition="popup-fade" position="top">{{innerH}}</mt-popup>
    <span class="littleBtn" @click="showTool = !showTool"></span>
    <div class="tophead" v-if="showTool">
      <span>字体</span>
      <span class="topheadBtn" @click="setFontSize('+')">+</span>
      <span class="topheadBtn" @click="setFontSize('-')">-</span>
      <span>行距</span>
      <span class="topheadBtn" @click="setLineHeight('+')">+</span>
      <span class="topheadBtn" @click="setLineHeight('-')">-</span>
    </div>
    <mt-swipe :auto="0" @change="handleChange" class="contentContainer">
      <mt-swipe-item v-for="cata in catalogs" :key="cata" continuous="false">
        <div class="loading" v-if="loading[cata]">
          <div class="loadEffect">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div class="bookContent" v-if="!loading[cata]" v-html="contentArr" ></div>
        <span class="cataBtn" @click.stop="showCata = !showCata"></span>
      </mt-swipe-item>
    </mt-swipe>
    <div class="catalog" v-if="showCata" @click.stop>
      <ul>
        <li v-for="(cata,index) in catalogs" :key="index" @click="resetChapter(cata)">{{cata}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { Tophead } from "./layout/components";
export default {
  name: "Dashboard",
  components: {
    Tophead
  },
  data() {
    return {
      innerH: "",
      popupVisible: false,
      catalogs: [],
      catalogsNext: {},
      showTool: false,
      showCata: false,
      curFontSize: 16,
      cunrLineHeightRate: 1.5,
      curChapter: "",
      contentArr: [],
      loading: {}
    };
  },
  computed: {
    ...mapGetters(["roles"])
  },
  mounted() {
    window.test = a => {
      this.$post(
        "SAVE_WORD",
        {
          word: a.innerHTML,
          bookName: this.$route.params.bookId,
          curChapter: this.curChapter
        },
        data => {
          this.innerH = a.innerHTML;
          this.popupVisible = true;
          window.setTimeout(() => {
            this.popupVisible = false;
          }, 200);
        }
      );
    };
    this.curFontSize = 16;
    this.curFontSize = parseInt(this.curFontSize);
    this.getCata(data => {
      this.curChapter = data[0];
      for (let i = 0; i < data.length; i++) {
        // this.loading[data[i]] = true;
        this.$set(this.loading, data[i], true);
      }
      this.getData();
    });
  },
  methods: {
    resetChapter(curChapter) {
      this.$post(
        "GET_BOOK_CONTENT",
        { bookName: this.$route.params.bookId, curChapter: curChapter },
        data => {
          if (data.retObj) {
            this.contentArr = data.retObj.contentArr;
          }
          this.loading = false;
        }
      );
    },
    handleChange(params) {
      this.curChapter = this.catalogs[params];
      this.getData();
    },
    // 获取目录
    getCata(callback) {
      if (this.catalogs.length) return;
      this.$post(
        "GET_BOOK_CATALOG",
        { bookName: this.$route.params.bookId },
        data => {
          if (data.retObj) {
            this.catalogs = data.retObj.files;
            for (let i = 0; i < data.retObj.files.length; i++) {
              this.catalogsNext[data.retObj.files[i]] =
                data.retObj.files[i + 1] || false;
            }
            callback(data.retObj.files);
          }
        }
      );
    },
    // 获取内容
    getData() {
      this.$post(
        "GET_BOOK_CONTENT",
        { bookName: this.$route.params.bookId, curChapter: this.curChapter },
        data => {
          if (data.retObj) {
            this.contentArr = data.retObj.contentArr;
          }
          this.loading[this.curChapter] = false;
        }
      );
    },
    setFontSize(type) {
      if (type == "+") {
        this.curFontSize++;
      } else {
        this.curFontSize--;
        if (this.curFontSize < 10) this.curFontSize = 10;
      }
      $(".bookContent").css("font-size", this.curFontSize + "px");
      // 设置行距
      $(".bookContent p").css(
        "line-height",
        this.curFontSize * this.cunrLineHeightRate + "px"
      );
    },
    setLineHeight(type) {
      console.log(this.cunrLineHeightRate, '--' ,this.curFontSize);
      if (type == "+") {
        this.cunrLineHeightRate += 0.1;
      } else {
        this.cunrLineHeightRate -= 0.1;
        if (this.cunrLineHeightRate < 1.5) this.cunrLineHeightRate = 1.5;
      }
      // 设置行距
      $(".bookContent p").css(
        "line-height",
        this.curFontSize * this.cunrLineHeightRate + "px"
      );
    }
  }
};
</script>

<style lang="scss">
li {
  list-style: none;
}
.mint-loadmore,
.mint-loadmore-content {
  height: 100%;
}
.readPane {
  position: relative;
  height: 100%;
  overflow: hidden;
  .v-modal {
    height: 40px;
    line-height: 40px;
    opacity: 0.3;
  }
  .mint-popup-top {
    line-height: 40px;
    background: transparent;
    color: greenyellow;
  }
}
.contentContainer {
  height: 100%;
  overflow-y: auto;
  padding: 10px;
  padding-top: 40px;
  font-size: 16px;
  span {
    padding: 2px 0;
    line-height: 1;
  }
}
.tophead {
  position: absolute;
  top: 0;
  width: 100%;
  height: 30px;
  left: 0;
  background: lightblue;
  line-height: 30px;
  text-align: center;
  z-index: 9991;
  .topheadBtn {
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 10px;
    font-size: 16px;
    border: solid 1px blue;
    margin: 0 10px;
  }
}
.hideHead {
  .contentContainer {
    padding-top: 10px;
  }
  .tophead {
    display: none;
  }
}
.mescroll {
  height: 100%;
  overflow: auto;
}
.littleBtn {
  position: absolute;
  right: 5px;
  top: 5px;
  width: 20px;
  height: 20px;
  background: rgba(57, 174, 207, 0.2);
  border-radius: 10px;
  z-index: 9999;
}

.bookContent {
  padding: 10px 15px;
  height: 100%;
  overflow: auto;
}
.mint-swipe-indicators {
  display: none;
}
.loading {
  position: absolute;
  background: rgba(0, 0, 0, 0.2);
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  z-index: 99999;
}
.load-container {
  width: 240px;
  height: 240px;
  float: left;
  position: relative;
  overflow: hidden;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
<style <style lang="scss">
@import "../styles/math.scss";
$per: "%";
// 整体半径
// $radius: 200px;
$radius: 80px;
// 小球半径
// $ball_radius: 26px;
$ball_radius: 0.3 * $radius;
// 时间间隔
$per_senconds: 0.15s;
// 小球数量
$ball_numbers: 12;
.loadEffect {
  width: 2 * $radius;
  height: 2 * $radius;
  position: relative;
  top: 50%;
  left: 50%;
  margin-top: -$radius;
  margin-left: -$radius;
  background: url(../assets/images/vocal.png);
  background-size: 1.16 * $radius auto;
  background-repeat: no-repeat;
  background-position: 0.6 * $radius $radius;
}
.loadEffect span {
  text-align: center;
  line-height: 2 * $ball_radius;
  display: inline-block;
  width: 0.54 * 2 * $ball_radius;
  height: 0.54 * 2 * $ball_radius;
  border-radius: 50%;
  background: #3094ef;
  position: absolute;
}

@for $j from 1 through 12 {
  @-webkit-keyframes load#{$j} {
    @for $i from 0 through 12 {
      #{100 * $i / $ball_numbers}#{$per} {
        $tt: $j - $i + 12;
        @if $tt%12 > 7 {
          @if $tt%12 == 11 {
            background: url(../assets/images/eat.png);
            background-size: 2 * $ball_radius auto;
            width: 2 * $ball_radius;
            height: 2 * $ball_radius;
          }
          @if $tt%12 != 11 {
            background: #d5eef7;
            width: 0.535 * 2 * $ball_radius;
            height: 0.535 * 2 * $ball_radius;
          }
        }
        @if $tt%12 < 8 {
          background: #3094ef;
          width: 0.535 * 2 * $ball_radius;
          height: 0.535 * 2 * $ball_radius;
        }
      }
    }
  }
}

@for $i from 1 through 12 {
  .loadEffect span:nth-child(#{$i}) {
    left: (1 - cos($i - 1)) * $radius;
    top: (1 - sin($i - 1)) * $radius;
    -webkit-animation-delay: $i * $per_senconds;
    -webkit-animation: load#{$i} $ball_numbers * $per_senconds ease infinite;
    -webkit-transform: rotate(($i - 1) * 30deg);
  }
}
</style>