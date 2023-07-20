<script setup>
</script>

<template>
  <!--首先分左右结构-->
  <div class="basic-layout">
    <!--  左边结构  -->
    <div class="nav-side"></div>
    <!--  右边结构  -->
    <div class="content-right">
      <!--TODO 右边结构分为上下-->
      <!--上结构-->
      <div class="nav-top">
        <div class="bread">面包屑</div>
        <div class="userinfo">用户</div>
      </div>
      <!--下内容区 -->
      <div class="wrapper">
        <div class="main-page">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.basic-layout {
  position: relative;

  .nav-side {
    position: absolute;
    width: 200px;
    height: 100vh;
    background: #001529;
    color: white;
    overflow-y: auto;
    transition: width .5s;
  }

  .content-right {
    margin-left: 200px;

    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #001529;
      padding: 0 20px;
    }

    .wrapper {
      background: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);

      .main-page {
        background: #fff;
        //height: calc(100vh - 90px);
        height: 100%;
      }
    }
  }
}
</style>