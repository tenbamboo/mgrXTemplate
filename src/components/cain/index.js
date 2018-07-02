import SparkMD5 from 'spark-md5'
import _ from 'lodash'
/**
 * @todo Cain工具包
 * @namespace Cain
 * @author haze.liu
 * @since 2017-10-12
 */
export default {
  $http: {}, //
  /**
   * @public
   * @function
   * @todo 获取Url中的值，如果没有再从localstorage,sessionstorage依次获取值
   * @memberof Cain
   * @param {String} name key的名字
   */
  getParam (name) {
    return this.getUrlParam(name) || localStorage.getItem(name) || sessionStorage.getItem(name)
  },
  /**
  * @public
  * @function
  * @todo 获取Url中的值
  * @memberof Cain
  * @param {String} name key的名字
  */
  getUrlParam (name) {
    if (this.isBlank(name)) {
      var url = decodeURI(location.search) // 获取url中"?"符后的字串
      var theRequest = {}
      if (url.indexOf('?') !== -1) {
        var str = url.substr(1)
        var strs = str.split('&')
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
        }
      }
      return theRequest
    } else {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      var r = window.location.search.substr(1).match(reg)
      if (r != null) {
        return decodeURI(r[2])
      }
    }
    return null
  },
  /**
       * @public
       * @function
       * @todo 对日期进行格式化
       * @memberof Cain
       * @param {Date} date 要格式化的日期
       * @param {String} format 进行格式化的模式字符串
       *     支持的模式字母有：
       *     y:年,
       *     M:年中的月份(1-12),
       *     d:月份中的天(1-31),
       *     h:小时(0-23),
       *     m:分(0-59),
       *     s:秒(0-59),
       *     S:毫秒(0-999),
       *     q:季度(1-4)
       */
  formatDate (date, format) {
    if (!date) {
      date = new Date()
    } else if (date.constructor === Date) {

    } else if (this.isBlank(date)) {
      date = new Date()
    }
    if (this.isBlank(format)) {
      format = 'yyyy-MM-dd hh:mm:ss'
    }

    if (typeof date === 'string') {
      if (date.substring(0, date.lastIndexOf('.')) !== '') {
        date = date.substring(0, date.lastIndexOf('.'))
      }
      date = date.replace(/-/g, '/')
    }

    date = new Date(date)
    var map = {
      M: date.getMonth() + 1, // 月份
      d: date.getDate(), // 日
      h: date.getHours(), // 小时
      m: date.getMinutes(), // 分
      s: date.getSeconds(), // 秒
      q: Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds() // 毫秒
    }
    format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
      var v = map[t]
      if (v !== undefined) {
        if (all.length > 1) {
          v = '0' + v
          v = v.substr(v.length - 2)
        }

        return v
      } else if (t === 'y') {
        return (date.getFullYear() + '').substr(4 - all.length)
      }

      return all
    })

    return format
  },
  /**
  * @public
  * @function
  * @todo  用于搜索时间中,替换时分秒成0:0:0使用
  * @memberof Cain
  * @param {String} date
  */
  setStartTime (date) {
    if (!this.isBlank(date)) {
      var a = new Date(date)
      a.setHours(0)
      a.setMinutes(0)
      a.setSeconds(0)
      return this.formatDate(a.getTime(), 'yyyy/MM/dd hh:mm:ss')
    }
    return ''
  },
  /**
   * @public
   * @function
   * @todo  用于搜索时间中,替换时分秒成23:59:59使用
   * @memberof Cain
   * @param {String} date
   */
  setEndTime (date) {
    if (!this.isBlank(date)) {
      var a = new Date(date)
      a.setHours(23)
      a.setMinutes(59)
      a.setSeconds(59)
      return this.formatDate(a.getTime(), 'yyyy/MM/dd hh:mm:ss')
    }
    return ''
  },
  /**
       * @public
       * @function
       * @todo 判断是否为空
       * @memberof Cain
       * @param {Object} obj 需要校验对象
       */
  isBlank (obj) {
    if (typeof obj === 'undefined' || obj === undefined || obj == null || obj === 'null' || (obj + '') === 'NaN' || obj === 'undefined' || obj === '' || obj.length === 0) {
      return true
    } else if (typeof obj === 'object' && obj.length === undefined) {
      for (var name in obj) {
        return false
      }
      return true
    } else {
      return false
    }
  },
  /**
       * @function getUUID
       * @memberof Cain
       * @public
       * @todo 生成UUID
       */
  getUUID () {
    this.getUUID.random4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }

    return (this.getUUID.random4() + this.getUUID.random4() + '-' + this.getUUID.random4() + '-' + this.getUUID.random4() + '-' + this.getUUID.random4() + '-' + this.getUUID.random4() + this.getUUID.random4() + this.getUUID.random4())
  },
  /**
       * @public
       * @function
       * @todo 生日转换为年龄
       * @memberof Cain
       * @param {String} birthday 日期格式为"2000-01-01"
       */
  brithdayConAges (strBirthday) {
    if (!strBirthday) {
      return 0
    }

    var returnAge
    var strBirthdayArr = strBirthday.split('-')
    var birthYear = strBirthdayArr[0]
    var birthMonth = strBirthdayArr[1]
    var birthDay = strBirthdayArr[2]
    var d = new Date()
    var nowYear = d.getFullYear()
    var nowMonth = d.getMonth() + 1
    var nowDay = d.getDate()

    if (nowYear === birthYear) {
      returnAge = 0 // 同年 则为0岁
    } else {
      var ageDiff = nowYear - birthYear // 年之差
      if (ageDiff > 0) {
        if (nowMonth === birthMonth) {
          var dayDiff = nowDay - birthDay // 日之差
          if (dayDiff < 0) {
            returnAge = ageDiff - 1
          } else {
            returnAge = ageDiff
          }
        } else {
          var monthDiff = nowMonth - birthMonth // 月之差
          if (monthDiff < 0) {
            returnAge = ageDiff - 1
          } else {
            returnAge = ageDiff
          }
        }
      } else {
        returnAge = -1 // 返回-1 表示出生日期输入错误 晚于今天
      }
    }

    return returnAge // 返回周岁年龄
  },
  // 获取cookie
  getCookie (name) {
    let cookieName = encodeURIComponent(name) + '='
    let cookieStart = document.cookie.indexOf(cookieName)
    let cookieValue = ''
    if (cookieStart > -1) {
      var cookieEnd = document.cookie.indexOf(';', cookieStart)
      if (cookieEnd === -1) {
        cookieEnd = document.cookie.length
      }
      cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd))
    }
    return cookieValue
  },
  // 设置cookie
  setCookie (name, value) {
    var Days = 30
    var exp = new Date()
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
    document.cookie = name + '=' + encodeURI(value) + ';expires=' + exp.toGMTString()
  },
  // 获取文件信息内容
  getFileInfo (file) {
    var uri = {
      fileUrl: '',
      fileName: '',
      fileType: '',
      data: ''
    }

    try {
      if (window.URL.createObjectURL) {
        // if (fileItems.length > 0) {
        var u = file
        uri.data = u
        uri.fileUrl = window.URL.createObjectURL(u)
        uri.fileName = u.name || ''
        // }
      }
      var index = uri.fileName.lastIndexOf('.')
      if (index !== -1) {
        uri.fileType = uri.fileName.substring(index + 1).toLowerCase()
        uri.fileName = uri.fileName.split('.')[0].toLowerCase()
      }
      return uri
    } catch (e) {
      throw e
    }
  },
  // 获取文件MD5
  getFileMD5Info (ofile) {
    return new Promise((resolve, reject) => {
      let file = ofile
      let tmpMd5 = ''
      let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
      let chunkSize = 8097152 // Read in chunks of 2MB
      let chunks = Math.ceil(file.size / chunkSize)
      let currentChunk = 0
      let spark = new SparkMD5.ArrayBuffer()
      let fileReader = new FileReader()

      fileReader.onload = function (e) {
        spark.append(e.target.result) // Append array buffer
        currentChunk++
        if (currentChunk < chunks) {
          loadNext()
        } else {
          tmpMd5 = spark.end()
          resolve(tmpMd5 + file.size)
        }
      }

      fileReader.onerror = function () {
        reject(new Error('MD5错误了'))
      }

      function loadNext () {
        var start = currentChunk * chunkSize
        var end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
      }
      loadNext()
    })
  },
  /**
  * @function getRowID
  * @memberof Cain
  * @public
  * @todo 生成Oracle RowID
  */
  getRowID () {
    return this.getUUID().replace(new RegExp('-', 'gm'), '')
  },
  /**
  * @public
  * @function
  * @todo  DB用时间戳
  * @memberof Cain
  * @param {String} date
  */
  getOperTime (date) {
    if (this.isBlank(date)) {
      return new Date().getTime() / 1000
    } else {
      if (date.substring(0, date.lastIndexOf('.')) !== '') {
        date = date.substring(0, date.lastIndexOf('.'))
      }
      date = date.replace(/-/g, '/')
    }
    return new Date(date).getTime() / 1000
  },
  /**
 * @public
 * @function
 * @todo  获取权限信息
 * @memberof Cain
 * @param {Object} $http this.$http容器
 * @param {String} menuId  对应表中的menuId
 */
  async getRoleInfo (menuId, $http) {
    return new Promise((resolve, reject) => {
      if (this.isBlank(menuId)) {
        reject(new Error('menuId 空'))
      } else if (this.isBlank(this.getCookie('rootRoleId'))) {
        reject(new Error('rootRoleId 空'))
      }
      let localInfo = this.getParam('roleInfo' + menuId)
      if (!this.isBlank(localInfo)) {
        resolve(JSON.parse(localInfo))
        return false
      }
      $http.post('bs/getRolePropertiesPage', {
        menuId: menuId,
        roleId: this.getCookie('rootRoleId')
      }).then(res => {
        if (!this.isBlank(res.data.l)) {
          sessionStorage.setItem('roleInfo' + menuId, JSON.stringify(res.data.l))
        }
        resolve(res.data.l)
      })
    })
  },
  /**
 * @public
 * @function
 * @todo  初始化Code工具
 * @memberof Cain
 * @param {Object} http this.$http容器
 */
  initHttp (http) {
    this.$http = http
  },
  /**
 * @public
 * @function
 * @todo  获取字典表信息
 * @memberof Cain
 * @param {String} code 字典值
 */
  getCode (code, $http = this.$http) {
    return new Promise(async (resolve, reject) => {
      let codeList = this.getParam('rootCodeList' + code)
      if (this.isBlank(codeList)) {
        const res = await $http.post('bs/getCodeList', { type: code })
        codeList = res.data

        // 转换可用

        sessionStorage.setItem('rootCodeList' + code, JSON.stringify(codeList))
      } else {
        codeList = JSON.parse(codeList)
      }
      resolve(codeList)
    })
  },
  /**
 * @public
 * @function
 * @todo  获提交图片信息
 * @memberof Cain
 * @param {FileList} fileList 需要上传的文件对象List
 * @param {AxiosObject} $httpFile 对应axios请求对象，需要['Content-Type'] = 'multipart/form-data'
 */
  fileUpload (fileList, $httpFile) {
    return new Promise(async (resolve, reject) => {
      let md5List = [] // 最后上传文件对应的md5

      // 获取没有fileCode的数据（新增数据）,进行md5校验
      for (let i in fileList) {
        if (this.isBlank(fileList[i].fileCode) && !this.isBlank(fileList[i].data)) {
          let md5 = await this.getFileMD5Info(fileList[i].data)
          fileList[i].fileCode = md5
        }
      }
      // 校验文件 是否存在
      const valFile = await $httpFile.post(
        'file/getFile', {
          fileList: fileList
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      // 开始上传文件
      let formdata = new FormData()
      for (let i in valFile.data) {
        fileList[i].errorCode = valFile.data[i].errorCode
        if (valFile.data[i].errorCode === '10003') {
          // 如果返回的code为10003时则代表需要上传数据
          formdata.append('files', fileList[i].data)
          md5List.push(fileList[i].fileCode)
        } else if (valFile.data[i].errorCode === '0') {
          // code为0 代表无需上传，服务器已有资源
          fileList[i].sourceUrl = valFile.data[i].fileUrl
        } else if (valFile.data[i].errorCode === '10004') {
          // code为10004 代表此数据无fileCode（md5值），此时啥也不干
        }
      }
      if (!this.isBlank(md5List)) {
        formdata.append('fileCode', md5List)
        const res = await $httpFile.post('file/uploadFile', formdata)

        for (let item of res.data) {
          let targerObj = _.find(fileList, { fileCode: item.fileCode })
          if (!this.isBlank(targerObj)) {
            targerObj.sourceUrl = item.fileUrl
          }
        }
      }
      resolve(fileList)
    })
  },
  /**
* @public
* @function
* @todo  快捷设置时间开始和结束
* @memberof Cain
* @param {Object} p 搜索集，其中包括字段KEY的内容（key的内容必须为数组【开始时间，结束时间】）
* @param {String} key 对应的p中的key
*/
  setDateRange (p, key) {
    if (!this.isBlank(p[key])) {
      p[`${key}Start`] = this.setStartTime(p[key][0])
      p[`${key}End`] = this.setEndTime(p[key][1])
    }
  }

}
