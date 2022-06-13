const splitStrings = (current, pageSize) => {
  let currentStr = ''
  for (let i = 0; i < pageSize / 2; i++) {
    if (i < current.length) {
      currentStr += `${current[i].name} x ${current[i].number}\n`
    }
  }

  let currentStr2 = ''
  for (let i = pageSize / 2; i < pageSize; i++) {
    if (i < current.length) {
      currentStr2 += `${current[i].name} x ${current[i].number}\n`
    }
  }

  return [currentStr, currentStr2]
}

export default splitStrings