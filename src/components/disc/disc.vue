<template>
    <transition name="slide">
      <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script>
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getSongList} from 'api/recommend'
  import {ERR_OK} from "api/config";
  import {createSong2} from 'common/js/song'

  export default {
        name: "disc",
      components:{
        MusicList
      },
      computed:{
        ...mapGetters([
          'disc'
        ]),
        title(){
          return this.disc.dissname
        },
        bgImage(){
          return this.disc.imgurl
        }

      },
    data(){
          return {
            songs:[]
          }
    },
      created(){
          this._getSongList()

      },
      methods:{
         _getSongList(){
           if (!this.disc.dissid){
             this.$router.push('/recommend')
             return
           }
           getSongList(this.disc.dissid).then((res)=>{
             if(res.code===ERR_OK){

               this.songs=this._normalize(res.cdlist[0].songlist)

             }
           })
         },
        _normalize(list){
           let ret=[]
          list.forEach((musicData)=>{
            if (musicData.id && musicData.album){
              ret.push(createSong2(musicData))
            }
          })
          return ret
        }
      }

    }
</script>

<style scoped  lang="stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)

</style>
