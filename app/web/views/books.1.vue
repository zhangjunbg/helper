<template>
  <div class="readPane" :class="showTool?'':'hideHead'" @click="showCata = false">
    <span class="littleBtn" @click="showTool = !showTool"></span>
    <div class="tophead" v-if="showTool">
      <span>字体</span>
      <span class="topheadBtn" @click="setFontSize('+')">+</span>
      <span class="topheadBtn" @click="setFontSize('-')">-</span>
      <span>行距</span>
      <span class="topheadBtn" @click="setLineHeight('+')">+</span>
      <span class="topheadBtn" @click="setLineHeight('-')">-</span>
    </div>
    <mt-swipe :auto="0" @change="handleChange">
      <mt-swipe-item>
        <div ref="mescroll" class="mescroll">
          <ul class="bookContent">
            <li v-for="(item,index) in contentArr" :key="index" v-html="item"></li>
          </ul>
        </div>
        <span class="cataBtn" @click.stop="showCata = !showCata"></span>
        <div class="catalog" v-if="showCata" @click.stop>
          <ul>
            <li v-for="(cata,index) in catalogs" :key="index" @click="resetChapter(cata)">{{cata}}</li>
          </ul>
        </div>
      </mt-swipe-item>
      <mt-swipe-item>2</mt-swipe-item>
      <mt-swipe-item>3</mt-swipe-item>
    </mt-swipe>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { Tophead } from "./layout/components";
import MeScroll from "mescroll.js";
import "mescroll.js/mescroll.min.css";
export default {
  name: "Dashboard",
  components: {
    Tophead
  },
  data() {
    return {
      catalogs: [],
      catalogsNext: {},
      mescroll: null, //mescroll实例对象
      showTool: false,
      showCata: false,
      curFontSize: 16,
      cunrLineHeightRate: 1.5,
      loading: false,
      contentData: "",
      pageData: {
        curPage: -1,
        pageSize: 10,
        lastIndex: 0
      },
      contentArr: []
    };
  },
  computed: {
    ...mapGetters(["roles"])
  },
  mounted() {
    window.test = a => {
      console.log(a);
      this.$post("SAVE_WORD", { word: a.innerHTML }, data => {});
    };
    this.curFontSize = 16;
    this.curFontSize = parseInt(this.curFontSize);
    //创建MeScroll对象
    // this.mescroll = new MeScroll(this.$refs.mescroll, {
    //   //在mounted初始化mescroll,确保此处配置的ref有值
    //   // down:{}, //下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则down可不用写了)
    //   up: {
    //     callback: this.upCallback,
    //     // 以下是一些常用的配置,当然不写也可以的.
    //     page: {
    //       num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
    //       size: 10 //每页数据条数,默认10
    //     },
    //     htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
    //     noMoreSize: 5 //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
    //   }
    // });
    this.getCata();
    this.getData();
  },
  methods: {
    handleChange(params) {
      console.log(params);
    },
    getCata() {
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
          }
        }
      );
    },
    upCallback() {
      this.loading = true;
      this.pageData.curPage = this.catalogsNext[this.pageData.curPage];

      this.$post(
        "GET_BOOK_CONTENT",
        { bookName: this.$route.params.bookId, ...this.pageData },
        data => {
          if (data.retObj) {
            this.contentArr.push(...data.retObj.contentArr);
            // this.pageData.lastIndex = data.retObj.allLastIndex;
            this.$nextTick(() => {
              this.mescroll.endSuccess(this.contentArr.length);
            });
          }
          this.loading = false;
        }
      );
    },
    getData() {
      this.loading = true;
      this.pageData.curPage = this.catalogsNext[this.pageData.curPage];

      this.$post(
        "GET_BOOK_CONTENT",
        { bookName: this.$route.params.bookId, ...this.pageData },
        data => {
          if (data.retObj) {
            this.contentArr.push(...data.retObj.contentArr);
            // this.pageData.lastIndex = data.retObj.allLastIndex;
            this.$nextTick(() => {
              this.mescroll.endSuccess(this.contentArr.length);
            });
          }
          this.loading = false;
        }
      );
    },
    resetChapter(chapter) {
      this.loading = true;
      this.pageData.curPage = 0;
      this.$post(
        "GET_BOOK_CONTENT",
        {
          bookName: this.$route.params.bookId,
          curChapter: chapter,
          ...this.pageData
        },
        data => {
          if (data.retObj) {
            this.contentArr.push(...data.retObj.contentArr);
            this.pageData.lastIndex = data.retObj.allLastIndex;
            this.$nextTick(() => {
              this.mescroll.endSuccess(this.contentArr.length);
            });
          }
          this.loading = false;
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
      $("#testId").css("font-size", this.curFontSize + "px");
      // 设置行距
      $("#testId p").css(
        "line-height",
        this.curFontSize * this.cunrLineHeightRate + "px"
      );
    },
    setLineHeight(type) {
      console.log(1);
      if (type == "+") {
        this.cunrLineHeightRate += 0.1;
      } else {
        this.cunrLineHeightRate -= 0.1;
        if (this.cunrLineHeightRate < 1.5) this.cunrLineHeightRate = 1.5;
      }
      // 设置行距
      $("#testId p").css(
        "line-height",
        this.curFontSize * this.cunrLineHeightRate + "px"
      );
    }
  },
  // 进入路由时,恢复列表状态
  beforeRouteEnter(to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
    next(vm => {
      if (vm.mescroll) {
        // 恢复到之前设置的isBounce状态
        if (vm.mescroll.lastBounce != null)
          vm.mescroll.setBounce(vm.mescroll.lastBounce);
        // 滚动到之前列表的位置 (注意:路由使用keep-alive才生效)
        if (vm.mescroll.lastScrollTop) {
          vm.mescroll.setScrollTop(vm.mescroll.lastScrollTop);
          setTimeout(() => {
            // 需延时,因为setScrollTop内部会触发onScroll,可能会渐显回到顶部按钮
            vm.mescroll.setTopBtnFadeDuration(0); // 设置回到顶部按钮显示时无渐显动画
          }, 16);
        }
      }
    });
  },
  // 离开路由时,记录列表状态
  beforeRouteLeave(to, from, next) {
    // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
    if (this.mescroll) {
      this.mescroll.lastBounce = this.mescroll.optUp.isBounce; // 记录当前是否禁止ios回弹
      this.mescroll.setBounce(true); // 允许bounce
      this.mescroll.lastScrollTop = this.mescroll.getScrollTop(); // 记录当前滚动条的位置
      this.mescroll.hideTopBtn(0); // 隐藏回到顶部按钮,无渐隐动画
    }
    next();
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
.cataBtn {
  position: absolute;
  left: 5px;
  bottom: 5px;
  width: 20px;
  height: 20px;
  background: rgba(57, 174, 207, 0.1);
  border-radius: 10px;
  z-index: 9999;
}
.catalog {
  background: rgba(173, 216, 230, 0.95);
  position: absolute;
  left: 0;
  width: 60%;
  height: 100%;
  top: 0;
  ul {
    padding: 10px 30px;
    height: 100%;
    overflow: auto;
  }
  li {
    list-style: none;
    font-size: 15px;
    line-height: 30px;
  }
}
.bookContent {
  padding: 10px 15px;
}
</style>

