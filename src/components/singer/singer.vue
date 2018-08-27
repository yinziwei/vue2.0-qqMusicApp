<template>
    <div class="singer" ref="singer"  >
      <list-view  @select="selectSinger" ref="list" :data="singers"></list-view>
      <router-view></router-view>
    </div>
</template>

<script>
  import ListView from 'base/listview/listview'
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from "api/config"
 import Singer from 'common/js/singer'
  import {mapMutations} from 'vuex'
  import {playlistMixin} from "common/js/mixin";

    const HOT_SINGER_LEN=10
    const HOT_NAME='热门'

  export default {
        name: "singer",
    mixins:[playlistMixin],
    data(){
          return {
            singers:[]
          }
    },
    created(){
          this._getSingerList()
    },
    methods:{
      handlePlaylist(playlist){
        const bottom=playlist.length>0 ? '60px':''
        this.$refs.singer.style.bottom=bottom
        this.$refs.list.refresh()
      },
      selectSinger(singer){
        this.$router.push({
          path: `/singer/${singer.id}`,

        })
        console.log('selectSinger')
        this.setSinger(singer)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      _getSingerList(){
            getSingerList().then((res)=>{
              if(res.code===ERR_OK){
                 this.singers=this._normalizeSinger(res.data.list)
              }
            })
          },
      _normalizeSinger(list){
            //热门歌手，挑出10个即可
            let map={
              hot:{
                title:HOT_NAME,
                items:[]
              }
            }
            list.forEach((item,index)=>{
              if (index<HOT_SINGER_LEN){
                map.hot.items.push(new Singer({
                name:item.Fsinger_name,
                id:item.Fsinger_mid
              }))
              }
              const key=item.Findex
              //这个item不在热门里面
              if(!map[key]){
                map[key]={
                  title:key,
                  items:[]
                }

              }
              //这个item在热门里面
              map[key].items.push(new Singer({
                name:item.Fsinger_name,
                id:item.Fsinger_mid
              }))

            })


        //因为对象遍历出来都是无序的，所以为了使其展示 A，B，C，等有序形式，需要处理map
        let ret=[]
        let hot=[]
        for(let key in map){
              let val=map[key]
              //谨记正则表达式为/[a-zA-Z]/  ，千万不要写成了/a-zA-Z/，气死我了
          if(val.title.match(/[a-zA-Z]/)){
            ret.push(val)
          }else if(val.title===HOT_NAME){
                hot.push(val)
          }
        }
        /*console.log('ret:'+ret.length)*/
        ret.sort((a,b)=>{
          return a.title.charCodeAt(0)-b.title.charCodeAt(0)
        })

        return hot.concat(ret)

    },

    },
    components:{
      ListView,

    }
    }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
