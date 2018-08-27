<template>
  <transition name="slide">
    <music-list :songs="songs" :bg-image="bgImage" :title="title"></music-list>
  </transition>
</template>

<script>
  import { mapGetters } from 'vuex'
  import {getSingerDetail} from "api/singer";
  import {ERR_OK} from "api/config";
  import {createSong} from 'common/js/song'
  import MusicList from 'components/music-list/music-list'

//控制播放器的变量一定是全聚德
  export default {
        name: "singer-detail",
    data(){
          return{
            songs:[]
          }
    },
     computed:{
          title(){
            return this.singer.name
          },
       bgImage(){
            return this.singer.avatar
       },
        ...mapGetters(['singer'])
      },
    created(){
          this._getDetail()
      },
      methods:{
        _getDetail(){
            //当刷新详情页时，如果没有点击过哪个歌手，则会返回到歌手页面
            if (!this.singer.id) {
             this.$router.push('/singer')
             return
            }
            getSingerDetail(this.singer.id).then((res)=>{
              if(res.code===ERR_OK){

                //这里调用_normalizeSongs函数的时候一定不能忘记this.不然就会找不到_normalizeSongs这个函数的
             this.songs= this._normalizeSongs(res.data.list)
                //console.log(this.songs)

              }
            })
          },
        //将歌曲的数据进行整理，只拿我们所需要的
        _normalizeSongs(list) {
          let ret = []
          list.forEach((item) => {
            let {musicData} = item
            if (musicData.songid && musicData.albummid) {

              ret.push(createSong(musicData))
            }
          })
          return ret
        }

      },
    components:{
          MusicList
    }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)



</style>
