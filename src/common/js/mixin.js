import {mapGetters,mapMutations,mapActions} from 'vuex'
import {playMode} from "common/js/config";
import {shuffle} from "common/js/util";
//几个组件共用的代码
export const playlistMixin={
  computed:{
    ...mapGetters([
      'playlist'
    ])
  },
  mounted(){
    this.handlePlaylist(this.playlist)
  },
  activated(){
    this.handlePlaylist(this.playlist)
  },
  watch:{
    playlist(newVal){
      this.handlePlaylist(newVal)
    }
  },
  methods:{
    //具体的组件自己根据各自的情况进行实现
    handlePlaylist(){
      throw new Error('component must implement handlePlaylist method')
    }
  }
}
export const playerMixin={
  computed:{
    ...mapGetters([
      'playlist',
      'currentSong',
      'mode',
      'sequenceList',
      'favoriteList'
    ]),
    iconMode(){
      return this.mode===playMode.sequence ? 'icon-sequence' : this.mode==playMode.loop ? 'icon-loop' :'icon-random'
    },
  },
  methods:{
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ]),
    ...mapMutations({
      setPlayState:'SET_PLAYING_STATE',
      setCurrentIndex:'SET_CURRENT_INDEX',
      setPlayMode:'SET_PLAY_MODE',
      setPlayList:'SET_PLAYLIST'
    }),
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },

    changeMode(){
      const mode=(this.mode+1)%3
      this.setPlayMode(mode)
      let list=null
      if(mode===playMode.random){
        //将一个数组打乱
        list= shuffle(this.sequenceList)
      }else{
        list=this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex(list){
      let index=list.findIndex((item)=>{
        return item.id===this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
  }
}
export const searchMixin={
  data(){
    return {
      query:'',
      refreshDelay:100
    }
  },

  computed: {
    ...mapGetters([
      'searchHistory'
    ]),
  },
    methods:{
      ...mapActions([
        'saveSearchHistory',
        'deleteSearchHistory',

      ]),
      saveSearch(){
        this.saveSearchHistory(this.query)
      },
      onQueryChange(query){
        this.query=query
      },
      addQuery(query){
        this.$refs.searchBox.setQuery(query)
      },
      blurInput() {
        this.$refs.searchBox.blur()
      },
    }

}

