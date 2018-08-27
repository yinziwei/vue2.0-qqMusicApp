<template>
    <div class="progress-bar" ref="progressBar" @click="progressClick">
      <div class="bar-inner">
        <div class="progress" ref="progress"></div>
        <div class="progress-btn-wrapper" ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend.prevent="progressTouchEnd">
          <div class="progress-btn"></div>
        </div>
      </div>
    </div>
</template>

<script>
  import {prefixStyle} from "common/js/dom";
const transform=prefixStyle('transform')
  const progressBtnWidth=16
  export default {
        name: "progress-bar",
      props:{
          percent:{
            type:Number,
            default:0
          }
      },
    created(){
          //用于不同的回调函数共享数据
      this.touch={}
    },

      watch:{
          percent(newPercent){
            //没拖动时watch，不然你拖了还是会滑回去的
            if(newPercent>=0 &&!this.touch.initiated){
              const barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth
              const offsetWidth=newPercent*barWidth
              this._offset(offsetWidth)
            }
          }

      },
      methods:{
        progressClick(e){
          //这里当点击progressBtn时e.offset获取不正确
          const rect=this.$refs.progressBar.getBoundingClientRect()

         // this._offset(e.offsetX)
          const offsetWidth=e.pageX-rect.left
          this._offset(offsetWidth)
          this._triggerPercent()
        },

        progressTouchStart(e){
            this.touch.initiated=true//初始化了
          this.touch.startX=e.touches[0].pageX//第一个手指接触的位置
          this.touch.left=this.$refs.progress.clientWidth//向左偏移的位置

        },
        progressTouchMove(e){
          //如果没有初始化，则就不做任何移动的回应，因为没有初始化就没能记录startX，等下就不好记录编谎话的位置
        if (!this.touch.initiated) {
          return
        }
        const deltaX=e.touches[0].pageX-this.touch.startX
          const offsetWidth=Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
          this._offset(offsetWidth)

        },
           progressTouchEnd(){
         this.touch.initiated=false

  //拖完后要派发事件你改变了多少，然后音频才能额跟得上进度
        this._triggerPercent()
        },
        _triggerPercent(){

          const barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth
          const  percent=this.$refs.progress.clientWidth/barWidth
          this.$emit('progressChange',percent)
        },
        _offset(offsetWidth){
          this.$refs.progress.style.width=`${offsetWidth}px`
          this.$refs.progressBtn.style[transform]=`translate3d(${offsetWidth}px,0,0)`

        }
      }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
