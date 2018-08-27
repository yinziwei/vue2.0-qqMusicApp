<template>
  <div id="app">
 <m-header></m-header>
    <tab></tab>
    <keep-alive>
   <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>
<!--//切换路由不会影响播放器的播放，所以将播放器组件放在app组件中-->
<script>
  import MHeader from 'components/m-header/m-header'
  import Tab from 'components/tab/tab'
  import Player from 'components/player/player'
export default {
  name: 'App',
  components:{MHeader,Tab,Player
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "common/stylus/variable.styl"
#app
   color:$color-theme
</style>
