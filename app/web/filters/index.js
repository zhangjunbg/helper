// set function parseTime,formatTime to filter
export { parseTime, formatTime } from '@/utils'

function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/* 数字 格式化*/
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

export function moneydecimal (value, param) {
  if (!value) {
    return '--'
  }
  if (isNaN(parseFloat(value))) return value
  let myValue = value
  let comma = 3 // 几位用逗号隔开
  let decimalTrue = true
  if (param > 20) {
    decimalTrue = false
  }
  param && param.length > 1 && comma > 0 && param <= 20 ? comma = param : comma = 3
  if (myValue) {
    let pre = ''
    let temp = myValue.toString()
    if (myValue < 0) {
      pre = temp[0]
      temp = temp.substr(1, temp.length)
    }
    // 小数点位数
    if (temp.indexOf('.') > -1) {
      if (temp.split('.')[1].length > 2) {
        temp = temp.substr(0, temp.indexOf('.') + 3)
      } else {
        if (temp.split('.')[1].length === 0) {
          temp = temp + '00'
        }
        if (temp.split('.')[1].length === 1) {
          temp = temp + '0'
        }
      }
    } else {
      temp = temp + '.00'
    }
    let r = temp.split('.')[1] ? temp.split('.')[1] : '00'
    // 用逗号隔开
    myValue = parseFloat((temp + '').replace(/[^\d\.-]/g, '')) + ''
    if (comma === 0) {
      return pre + myValue + '.' + r
    }
    let l = myValue.split('.')[0].split('').reverse()
    let t = ''
    for (let i = 0; i < l.length; i++) {
      t += l[i] + ((i + 1) % comma === 0 && (i + 1) !== l.length ? ',' : '')
    }
    if (decimalTrue) {
      return pre + t.split('').reverse().join('') + '.' + r
    } else {
      return pre + t.split('').reverse().join('')
    }
  }

  if (decimalTrue) {
    return '0.00'
  } else {
    return '0'
  }
}