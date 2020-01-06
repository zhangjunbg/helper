const l = 42, // 滑块边长
  r = 10, // 滑块半径
  w = 310, // canvas宽度
  h = 155, // canvas高度
  PI = Math.PI
const L = l + r * 2 // 滑块实际边长
const helper = {
  getRandomNumberByRange(start, end) {
    let temp = Math.round(Math.random() * (end - start) + start);
    return temp
  },
  createCanvas(width, height) {
    const canvas = helper.createElement('canvas')
    canvas.width = width
    canvas.height = height
    return canvas
  },
  createImg(onload) {
    const img = helper.createElement('img')
    img.crossOrigin = "Anonymous"
    img.onload = onload
    img.src = '/public/img/picverify.jpg'
    return img
  },
  createElement(tagName) {
    return document.createElement(tagName)
  },
  addClass(tag, className) {
    tag.classList.add(className)
  },
  removeClass(tag, className) {
    tag.classList.remove(className)
  },
  draw(ctx, operation, x, y) {
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + l / 2, y)
    ctx.arc(x + l / 2, y - r + 2, r, 0, 2 * PI)
    ctx.lineTo(x + l / 2, y)
    ctx.lineTo(x + l, y)
    ctx.lineTo(x + l, y + l / 2)
    ctx.arc(x + l + r - 2, y + l / 2, r, 0, 2 * PI)
    ctx.lineTo(x + l, y + l / 2)
    ctx.lineTo(x + l, y + l)
    ctx.lineTo(x, y + l)
    ctx.lineTo(x, y)
    ctx.fillStyle = '#fff'
    ctx[operation]()
    ctx.beginPath()
    ctx.arc(x, y + l / 2, r, 1.5 * PI, 0.5 * PI)
    ctx.globalCompositeOperation = "xor"
    ctx.fill()
  }
};
class jigsawee {
  constructor(el, options) {
    this.el = el
    this.success = options.success
    this.fail = options.fail
    this.refresh = options.refresh
    this.verifyFun = options.verify
    this.x = options.x;
    this.y = options.y;
  }
  init() {
    this.initDOM()
    this.initImg()
    this.draw()
    this.bindEvents()
  }
  initDOM() {
    const canvas = helper.createCanvas(w, h) // 画布
    const block = canvas.cloneNode(true) // 滑块
    const sliderContainer = helper.createElement('div')
    const refreshIcon = helper.createElement('div')
    const sliderMask = helper.createElement('div')
    const slider = helper.createElement('div')
    const sliderIcon = helper.createElement('span')
    const text = helper.createElement('span')

    block.className = 'block'
    sliderContainer.className = 'sliderContainer'
    refreshIcon.className = 'refreshIcon el-icon-refresh'
    sliderMask.className = 'sliderMask'
    slider.className = 'slider'
    sliderIcon.className = 'sliderIcon'
    text.innerHTML = '向右滑动滑块填充拼图'
    text.className = 'sliderText'

    const el = this.el
    el.appendChild(canvas)
    el.appendChild(refreshIcon)
    el.appendChild(block)
    slider.appendChild(sliderIcon)
    sliderMask.appendChild(slider)
    sliderContainer.appendChild(sliderMask)
    sliderContainer.appendChild(text)
    el.appendChild(sliderContainer)

    Object.assign(this, {
      canvas,
      block,
      sliderContainer,
      refreshIcon,
      slider,
      sliderMask,
      sliderIcon,
      text,
      canvasCtx: canvas.getContext('2d'),
      blockCtx: block.getContext('2d')
    })
  }
  initImg() {
    const img = helper.createImg(() => {
      this.canvasCtx.drawImage(img, 0, 0, w, h)
      this.blockCtx.drawImage(img, 0, 0, w, h)
      const y = this.y - r * 2 + 2
      const ImageData = this.blockCtx.getImageData(this.x, y, L, L)
      this.block.width = L
      this.blockCtx.putImageData(ImageData, 0, y)
    })
    this.img = img
  }
  draw() {
    // 镂空的块
    helper.draw(this.canvasCtx, 'fill', this.x, this.y)
    // 被挖出来的块的形状遮罩层
    helper.draw(this.blockCtx, 'clip', this.x, this.y)
  }
  clean() {
    this.canvasCtx.clearRect(0, 0, w, h)
    this.blockCtx.clearRect(0, 0, w, h)
    this.block.width = w
  }

  bindEvents() {
    this.el.onselectstart = () => false
    this.refreshIcon.onclick = () => {
      this.refresh(options => {
        this.reset(options)
      })
    }
    let originX, originY, trail = [],
      isMouseDown = false
    this.slider.addEventListener('mousedown', function (e) {
      originX = e.x, originY = e.y
      isMouseDown = true
    })
    document.addEventListener('mousemove', (e) => {
      if (!isMouseDown) return false
      const moveX = e.x - originX
      const moveY = e.y - originY
      if (moveX < 0 || moveX + 38 >= w) return false
      this.slider.style.left = moveX + 'px'
      var blockLeft = (w - 40 - 20) / (w - 40) * moveX
      this.block.style.left = blockLeft + 'px'

      helper.addClass(this.sliderContainer, 'sliderContainer_active')
      this.sliderMask.style.width = moveX + 'px'
      trail.push(moveY)
    })
    document.addEventListener('mouseup', (e) => {
      if (!isMouseDown) return false
      isMouseDown = false
      if (e.x == originX) return false
      helper.removeClass(this.sliderContainer, 'sliderContainer_active')
      this.trail = trail
      this.verify(this.trail, res => {
        if (res.retCode == "success") {
          helper.addClass(this.sliderContainer, 'sliderContainer_success')
          this.success && this.success()
        } else if (res.retCode == "again") {
          helper.addClass(this.sliderContainer, 'sliderContainer_fail')
          this.text.innerHTML = '再试一次';
          this.reset(res.data)
        }else{
          this.reset(res.data)
          this.fail();
        }
      })
    })
  }

  verify(arr, callBack) {
    // 服务端验证
    this.verifyFun({
      arr: arr,
      left: this.block.style.left
    }, res => {
      callBack(res);
      if (res.retCode == "success") {
        this.success();
      } else if (res.retCode == "again") {
        this.reset(res.data);
      }
    });
  }

  reset(options) {
    this.x = options.x;
    this.y = options.y;
    this.sliderContainer.className = 'sliderContainer'
    this.slider.style.left = 0
    this.block.style.left = 0
    this.sliderMask.style.width = 0
    this.clean()
    this.img.src = '/public/img/picverify.jpg';
    this.draw()
  }

}
const jigsaw = {
  init: function (element, options) {
    new jigsawee(element, options).init()
  }
}
export default jigsaw;