import {playMode} from "common/js/config";
import {loadSearch,loadPlay,loadFavorite} from "common/js/cache"
//只保存基本的数据，其他要的属性可以根绝这些基本属性计算得来
const state = {
  singer: {},
  playing:false,
  fullScreen:false,
  playlist: [],
  sequenceList:[],
  mode:playMode.sequence,
  currentIndex:-1,//当前播放的索引
  disc:{},
  topList:{},
  searchHistory:loadSearch(),
  playHistory:loadPlay(),
  favoriteList:loadFavorite()
}
export default state
