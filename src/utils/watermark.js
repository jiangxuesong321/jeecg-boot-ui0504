let watermark = {}

let setWatermark = (str,date) => {
  let id = '1.23452384164.123412416'

  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id))
  }

  //创建一个画布
  let can = document.createElement('canvas')
  //设置画布的长宽
  can.width = 200
  can.height = 180

  let cans = can.getContext('2d')
  //旋转角度
  cans.rotate(-15 * Math.PI / 180)
  cans.font = '14px Vedana'
  //设置填充绘画的颜色、渐变或者模式
  cans.fillStyle = 'rgba(0, 0, 255, 0.26)'
  //设置文本内容的当前对齐方式
  cans.textAlign = 'left'
  //设置在绘制文本时使用的当前文本基线
  cans.textBaseline = 'Middle'
  //在画布上绘制填色的文本（输出的文本，开始绘制文本的X坐标位置，开始绘制文本的Y坐标位置）
  cans.fillText(str, can.width / 8, can.height / 2)
  cans.fillText(date,can.width / 8, can.height / 3)
  let div = document.createElement('div')
  div.id = id
  div.style.pointerEvents = 'none'
  div.style.top = '0px'
  div.style.left = '0px'
  div.style.position = 'absolute'
  div.style.zIndex = '100000'
  div.style.width = '90%'
  div.style.height = '90%'
  div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
  //   document.body.appendChild(div)
  div.style.opacity = '0' // 水印的透明度
  let show = document.getElementById("show1") // 控制水印显示的区域，设置id = show,表示在该范围内有水印
  if(show != null && show != undefined){
    show.appendChild(div)
  }
  return id
}

// 该方法只允许调用一次
watermark.set = (str,date) => {
  let id = setWatermark(str,date) // str,date代表的是两行水印。如果需好几个的话再追加。
  setInterval(() => {
    if (document.getElementById(id) === null) {
      id = setWatermark(str,date)
    }
  }, 500);
  window.onresize = () => {
    setWatermark(str,date)
  };
}

export default watermark
