import storage from 'good-storage'
//这里放于本地缓存的逻辑
const SEARCH_KEY='_search_'
const SEARCH_MAX_LENGTH=15
const PLAY_KEY='_play_'
const PLAY_MAX_LENGTH=200
const FAVORITE_KEY='_FAVORITE_'
const FAVORITE_MAX_LEN=200
//把选择的插入到数组中
function insertArray(arr,val,compare,maxLen) {
  const index=arr.findIndex(compare)
  //是第一条数据
  if (index===0) {
    return
  }
  if (index>0){
    arr.splice(index,1)
  }
  arr.unshift(val)
  if (maxLen && arr.length>maxLen){
    arr.pop()
  }
}
//删除历史记录
function deleteFromArray(arr,compare) {
  const index=arr.findIndex(compare)
  if (index>-1){
    arr.splice(index,1)
  }

}
//将query插入到当前的播放历史中，插完之后保存，再把新数组return出去
export function saveSearch(query) {
 let searches=storage.get(SEARCH_KEY,[])
  insertArray(searches,query,(item)=>{
    return item===query
  },SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY,searches)
  return searches

}
export function loadSearch() {
  return storage.get(SEARCH_KEY,[])
}
export function deleteSearch(query) {
  let searches=storage.get(SEARCH_KEY,[])
  deleteFormArray(searches,(item)=>{
    return item===query
  })
  storage.set(SEARCH_KEY,searches)
  return searches
}
export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}
export function savePlay(song) {
  let songs=storage.get(PLAY_KEY,[])
  insertArray(songs,song,(item)=>{
    return  item.id===song.id
  },PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY,songs)
  return songs
}
export function loadPlay() {
  return storage.get(PLAY_KEY,[])
}
export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LEN)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}
