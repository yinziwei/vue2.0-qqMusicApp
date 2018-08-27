<template>
    <scroll  :listenScroll="listenScroll" :data="data" class="listview" ref="listview" @scroll="scroll" :probe-type="probeType">
      <ul>
        <li v-for="group in data" class="list-group" ref="listGroup">
          <h2 class="list-group-title" >
            {{group.title}}
          </h2>
          <ul>
            <li   @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
              <img v-lazy="item.avatar" class="avatar">
              <span class="name">{{item.name}}</span>
            </li>
          </ul>
        </li>
      </ul>
    <!--  旁边的快捷字母-->
      <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove" @touchend.stop>
        <ul>
         <!-- 又犯错了，这里应该是(item,index)，而不是{item,index}-->
          <li v-for="(item,index) in shortcutList" class="item" :data-index="index"  :class="{'current':currentIndex===index}">{{item}}</li>
        </ul>
      </div>
<!--      最顶部的标题-->
     <div class="list-fixed" ref="fixed" v-show="fixedTitle">
        <div class="fixed-title">{{fixedTitle}}</div>
      </div>


    </scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
 /* import loading from 'base/loadinf/loading'*/
  import {getData} from 'common/js/dom'
  //这个表示旁边菜单中一个字母的高度
  const ANCHOR_HEIGHT=18
  const TITLE_HEIGHT=30
    export default {
        name: "listview",
      props:{
          data:{
            type:Array,
            default:[]
          }
      },
      data(){
          return {
            currentIndex:0,
            scrollY:-1,
            diff:-1
          }
      },
      created(){
        this.probeType=3
          this.touch={}
          this.listHeight=[]
          this.listenScroll=true

      },
      watch:{
        data(){
          //数据到dom有个延迟，等数据都渲染好了了以后再计算高度
          setTimeout(()=>{
            this._calculateHeight()
          },20)
        },
        scrollY(newY){
          const listHeight=this.listHeight
          //当滚到顶部，newY>0
          if(newY>0){
            //console.log(newY)
            this.currentIndex=0
            return
          }
          //在中间部分滚动时
          for(let i=0;i<listHeight.length-1;i++){
            let height1=listHeight[i]
            let height2=listHeight[i+1]
            //这里为什么要加上等号，我还不清楚
            if(-newY>=height1 && -newY<height2){
              this.currentIndex=i
              this.diff=height2+newY

              return

            }
          }
          //当滚到底部时，且-newY大于最后一个元素的上限,不理解为什么
          this.currentIndex=listHeight.length-2
        },
        diff(newVal){
          //这里的原理我不懂
         /* console.log('newVal'+newVal)*/
          let fixedTop=(newVal>0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
         /* console.log('fixedTop'+fixedTop)
          console.log('this.fixedTop'+this.fixedTop)*/
          if(this.fixedTop===fixedTop){
          /*  console.log('进来了')*/
            return
          }
          this.fixedTop=fixedTop
          //注意这里的``和''是不同的
          this.$refs.fixed.style.transform=`translate3d(0,${fixedTop}px,0)`
         /* this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`*/

        }
      },
      computed:{
        shortcutList(){
          return this.data.map((group)=>{
            //不可以去掉substr()，因为最前面有一个‘热门‘
            return group.title.substr(0,1)
          })
        },
       fixedTitle(){
          if(this.scrollY>0){
            return ''
          }
          return this.data[this.currentIndex] ? this.data[this.currentIndex].title:''
        }
      },
      methods:{
          refresh(){
            this.$refs.listview.refresh()
          },
          onShortcutTouchStart(e){
            let anchorIndex=getData(e.target,'index')
            let firstTouch=e.touches[0]
            this.touch.y1=firstTouch.pageY
            this.touch.anchorIndex=anchorIndex
            this._scrollTo(anchorIndex)
          },
        onShortcutTouchMove(e){
          let firstTouch=e.touches[0]
          this.touch.y2=firstTouch.pageY
          let delda=( this.touch.y2- this.touch.y1)/ANCHOR_HEIGHT|0
          let anchorIndex=parseInt( this.touch.anchorIndex)+delda
          this._scrollTo(anchorIndex)
        },
        scroll(pos){
            this.scrollY=pos.y
        },
        refresh() {
          this.$refs.listview.refresh()
        },
        _scrollTo(index){
            if(!index && index!==0){
              return
            }
            if(index<0){
              index=0
            }else if(index>this.listHeight.length-2){
              index =this.listHeight-2
            }
            this.scrollY=-this.listHeight[index]
          this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0)
        },
        //计算每个group的高度.
        _calculateHeight(){
          this.listHeight==[]
          const list=this.$refs.listGroup
          let height =0
          this.listHeight.push(height)
          for(let i=0;i<list.length;i++){
              let item=list[i]
            height+=item.clientHeight
            this.listHeight.push(height)
          }
        },
        selectItem(item){
          this.$emit('select', item)
        }

      },

      components:{
        Scroll,
      }

    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

