<template>
    <transition name="slide">
      <music-list :title="title" :bgImage="bgImage" :songs="songs" :rank="rank"></music-list>
    </transition>
</template>

<script>
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getMusicList} from 'api/rank'
  import {ERR_OK} from "api/config";
  import {createSong} from "common/js/song";
  import {playlistMixin} from "common/js/mixin";

  export default {
        name: "top-list",
    mixins:[playlistMixin],
      components:{
        MusicList
      },
      data(){
          return{
            songs:[],
            rank:true
          }
      },
      computed:{
        ...mapGetters([
          'topList'
        ]),
        title(){
          return this.topList.topTitle
        },
        bgImage(){
          if (this.songs.length){
            return this.songs[0].image
          }

        }
      },
      created(){
          this._getMusicList()
      },
      methods:{
          handlePlaylist(playlist){
            return
          },
          _getMusicList(){
            if (!this.topList.id){
              this.$router.push('/rank')
              return
            }
            getMusicList(this.topList.id).then((res)=>{
              if (res.code===ERR_OK) {
               // console.log(res.songlist)
                this.songs=this._normalize(res.songlist)
              }
            })
          },
        _normalize(list){
            let ret=[]
          list.forEach((item)=>{
            const musicData=item.data

            if(musicData.songid && musicData.albumid){

              ret.push(createSong(musicData))
            }
          })

            return ret
        }
      }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
