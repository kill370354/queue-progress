# 说明

- 云函数的使用说明在 cloudfunctions-dev 文件夹中。

- 如要要运行到微信小程序，需要配置 cloudfunctions-dev/src/utils/constants.js 里的内容，否则无法授权登录。其他的按照 uniapp 的流程便是。

&emsp;&emsp;如果发现了什么问题，请告知我，虽然功能不多，程序未必使人满意，可是 BUG 总是不可容忍的。

# 心里话

&emsp;&emsp;这是我的毕业设计。缘起于之前一次面试，也不知道是按什么顺序叫人的，等了很久，故而希望有一个可以及时通知排队用户的小程序。也看了很多，多是与餐饮、医院有关，而限于能力，我很难与实体业关联，便想到做一个这样比较通用的小程序。

&emsp;&emsp;微信小程序发通知有限制，点一次按钮只能发送一次通知，尽管我觉得这样很不好，不能多发送几次反馈，就不能及时掌握进度，可是又认同微信“不愿打扰用户”的思想，就没有做点一次发一次的功能，而只是关注和加入，对同一队列同一用户最多发送两条。

&emsp;&emsp;最遗憾的是没有用到类的封装思想。之前本也打算使用 TS ，融合多种设计模式开发，还想充分利用本地缓存，可惜限于才力，不得不一舍再舍，丢了很多想要的功能。

&emsp;&emsp;本希望做得尽善尽美，给大学四年的学习画上一个圆满的句号。奈何世事难料，我在寒假期间经历了诸多波折，心绪不宁，又限于才力，只得如此了。

&emsp;&emsp;倘若有幸得诸位认可，心存感激，将来得空，可能继续完善。

&emsp;&emsp;微信小程序：![排队进度](https://raw.githubusercontent.com/kill370354/queue-progress/master/static/images/queue-progress-wx.jpg "排队进度")

&emsp;&emsp;[github 源代码](https://github.com/kill370354/queue-progress/)
&emsp;&emsp;[H5 打包成品](https://kill370354.github.io/queue-progress/)

<p align="right">2020 年 4 月初</p>