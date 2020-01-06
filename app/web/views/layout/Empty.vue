<template>
  <div class="opeContainer">
    <router-view />
  </div>
</template>
<style lang="scss">
.opeContainer {
  box-sizing: border-box;
}
.commTitle {
  margin: 0 0 20px;
  font-size: 16px;
  line-height: 24px;
  color: #333;
  text-align: left;
}
.el-table {
  th {
    background: #ededed;
  }
  tr td {
    border-bottom: solid 1px #f1f1f1;
  }
}
.nextTitle {
  text-align: left;
  font-size: 18px;
  color: #2f2f2f;
}
</style>
