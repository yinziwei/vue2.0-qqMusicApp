import {getLyric} from "api/song";
import {ERR_OK} from "api/config";
import {Base64} from "js-base64"

export default class Song{
  //设成类的好处是拓展性好，然后便于维护
  constructor({id,mid,singer,name,album,duration,image,url}){
    this.id=id
    this.mid=mid
    this.singer=singer
    this.name=name
    this.album=album
    this.duration=duration
    this.image=image
    this.url=url
  }
  getLyric() {
    if (this.lyric){
      return Promise.resolve(this.lyric)
    }
    //该函数就一个作用，获取歌词，不对歌词做处理，将歌词返回出去
    return new Promise((resolve ,reject)=>{
      getLyric(this.mid). then((res)=>{
        if(res.retcode===ERR_OK){
          this.lyric=Base64.decode(res.lyric)
         resolve(this.lyric)
        }else{
          reject('no lyric')
        }
      })
    })

  }
}
//创建一个歌曲的类的工厂方法
export function createSong(musicData) {
 return new Song({
   id:musicData.songid,//这个必有
   mid:musicData.songmid,
   singer:filterSinger(musicData.singer),
   name:musicData.songname,
   album:musicData.albumname,//这个必有
   duration:musicData.interval,
   image:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
   //注意这里的音乐的播放地址总是会变，所以记得要及时换
   url:`http://ws.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=0&guid=126548448`



 })

}
function filterSinger(singer) {
  let ret=[]
  if(!singer){
    return ''
  }
  singer.forEach((s)=>{
    ret.push(s.name)
  })
  return ret.join('/')

}
export function createSong2 (musicData) {
  return new Song({
    id: musicData.id,
    mid: musicData.mid,
    singer: filterSinger(musicData.singer),
    name: musicData.name,
    album:musicData.album.name,//这个必有
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.album.mid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/C100${musicData.mid}.m4a?fromtag=0&guid=126548448`
  })
}

