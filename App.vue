<script>
import Vue from 'vue';
export default {
  data() {
    return { user: {} };
  },

  watch: {
    '$store.state.user.userId': {
      handler(newValue) {
        //console.log('user change', newValue);
      },
    },
  },
  onLaunch: function() {
    //console.log('laun');
    uni.getSystemInfo({
      success: function(e) {
        // #ifndef MP
        Vue.prototype.StatusBar = e.statusBarHeight;
        if (e.platform == 'android') {
          Vue.prototype.CustomBar = e.statusBarHeight + 50;
        } else {
          Vue.prototype.CustomBar = e.statusBarHeight + 45;
        }
        // #endif

        // #ifdef MP-WEIXIN
        Vue.prototype.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        Vue.prototype.Custom = custom;
        Vue.prototype.CustomBar =
          custom.bottom + custom.top - e.statusBarHeight;
        // #endif

        // #ifdef MP-ALIPAY
        Vue.prototype.StatusBar = e.statusBarHeight;
        Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
        // #endif

        //#ifdef APP-PLUS
        var info = plus.push.getClientInfo();
        //console.log('55555555555555555555', JSON.stringify(info));
        /* 5+  push 消息推送 ps:使用:H5+的方式监听，实现推送*/

        plus.push.addEventListener(
          'click',
          function(msg) {
            //console.log('click:' + JSON.stringify(msg));
            uni.showModal({
              content: 'click:' + JSON.stringify(msg),
            });
            //console.log(msg.payload);
            //console.log(JSON.stringify(msg));
            //这里可以写跳转业务代码
          },
          false
        );
        // 监听在线消息事件
        plus.push.addEventListener(
          'receive',
          function(msg) {
            uni.showModal({
              content: 'receive:' + JSON.stringify(msg),
            });
            // plus.ui.alert(2);
            //这里可以写跳转业务代码
            //console.log('recevice:' + JSON.stringify(msg));
          },
          false
        );

        //#endif
      },
    });

    Vue.prototype.ColorList = [
      {
        title: '嫣红',
        name: 'red',
        color: '#e54d42',
      },
      {
        title: '桔橙',
        name: 'orange',
        color: '#f37b1d',
      },
      {
        title: '明黄',
        name: 'yellow',
        color: '#fbbd08',
      },
      {
        title: '橄榄',
        name: 'olive',
        color: '#8dc63f',
      },
      {
        title: '森绿',
        name: 'green',
        color: '#39b54a',
      },
      {
        title: '天青',
        name: 'cyan',
        color: '#1cbbb4',
      },
      {
        title: '海蓝',
        name: 'blue',
        color: '#0081ff',
      },
      {
        title: '姹紫',
        name: 'purple',
        color: '#6739b6',
      },
      {
        title: '木槿',
        name: 'mauve',
        color: '#9c26b0',
      },
      {
        title: '桃粉',
        name: 'pink',
        color: '#e03997',
      },
      {
        title: '棕褐',
        name: 'brown',
        color: '#a5673f',
      },
      {
        title: '玄灰',
        name: 'grey',
        color: '#8799a3',
      },
      {
        title: '草灰',
        name: 'gray',
        color: '#aaaaaa',
      },
      {
        title: '墨黑',
        name: 'black',
        color: '#333333',
      },
      {
        title: '雅白',
        name: 'white',
        color: '#ffffff',
      },
    ];
    const user = uni.getStorageSync('user');
    if (user) {
      //console.log('onLoad', JSON.stringify(user));
      this.user = user;

      // #ifndef MP
      this.signIn();

      // #endif
    } else {
      //console.log('未获取到用户信息');
    }
  },
  onShow: function() {
    //console.log('App Show');
  },
  onHide: function() {
    //console.log('App Hide');
  },
  onReady() {},
  onPageNotFound(e) {
    //console.log(e);
    uni.switchTab({
      url: '/pages/index/index',
    });
  },
  methods: {
    getCode() {
      return new Promise((resolve, reject) => {
        uni.login({
          provider: 'weixin',
          success(e) {
            if (e.code) {
              resolve(e.code);
            } else {
              reject(new Error('微信登录失败'));
            }
          },
          fail(e) {
            reject(new Error('微信登录失败'));
          },
        });
      });
    },
    wxGetUserInfo(res) {
      // if (!res.detail.iv) {
      //   uni.showToast({
      //     title: '登录失败',
      //     icon: 'none',
      //   });
      //   return false;
      // }
      // //console.log('wxGetUserInfo', res);

      let that = this;
      let user = {};
      uni.getUserInfo({
        provider: 'weixin',
        success: function(infoRes) {
          //console.log('uni.getUserInfo', infoRes);
          user.name = infoRes.userInfo.nickName;
          user.avatar = infoRes.userInfo.avatarUrl;
          //console.log(9);
          that
            .getCode()
            .then(code => {
              //console.log('code', code);
              return uniCloud.callFunction({
                name: 'login',
                data: {
                  code,
                  user,
                },
              });
            })
            .then(res => {
              uni.hideLoading();
              //console.log(res);
              if (res.result.status !== 0) {
                return Promise.reject(new Error(res.result.msg));
              }
              if (res.result.code === 0) {
                user.userId = res.result.userInfo.openid;
                user.token = res.result.token;
                that.$setUser(user);
                uni.showToast({
                  title: '登录成功',
                  duration: 1000,
                });
              } else {
                uni.showToast({
                  title: res.result.msg,
                  duration: 1000,
                });
              }
            })
            .catch(err => {
              //console.log(err);
              uni.hideLoading();
              uni.showToast({
                title: '出现错误，请稍后再试.' + err.message,
                duration: 2000,
              });
            });
        },
      });
    },
    signIn() {
      let that = this;
      //console.log(111, this.user);
      const { userId, password } = this.user;
      if (userId === '') return;
      if (userId.length < 6 || password.length < 6) {
        uni.showModal({
          content: '用户名密码长度均不能小于6',
          showCancel: false,
        });
        return;
      }
      uni.showLoading({
        title: '登录中...',
      });
      uniCloud
        .callFunction({
          name: 'signIn',
          data: {
            userId,
            password,
          },
        })
        .then(res => {
          //console.log(res);
          if (res.result.status !== 0) {
            return Promise.reject(new Error(res.result.msg));
          }
          uni.setStorageSync('token', res.result.token);

          uni.hideLoading();
          uni.showToast({
            title: '登录成功',
          });
          //console.log(55555666, JSON.stringify(res.result.user));
          that.$setUser(res.result.user);
        })
        .catch(err => {
          //console.log(2222, userId, password);
          //console.log(err);
          uni.hideLoading();
          uni.showToast({
            title: '登录失败，' + err.message,
            icon: 'none',
          });
        });
    },
  },
};
</script>

<style lang="scss">
@import './common/css/uni.css';
@import 'colorui/main.css';
@import 'colorui/icon.css';

page {
  color: $my-text-color-light;
  // background-color: $uni-bg-color-grey;
  min-height: 100%;
  .dark {
    min-height: 100vh;
    color: $my-text-color-dark;
    background-color: $my-bg-color-dark;
  }
}
// uni-page-body {
//   background-color: #000;
// }
.uni-page-refresh--refreshing .uni-page-refresh {
  top: 60rpx;
}
.bg-black .search-form {
  background-color: $my-bg-color-dark;
  color: $my-text-color-dark;
}
.nav-list {
  display: flex;
  flex-wrap: wrap;
  padding: 0px 40upx 0px;
  justify-content: space-between;
}

.nav-li {
  padding: 30upx;
  border-radius: 12upx;
  width: 45%;
  margin: 0 2.5% 40upx;
  background-image: url(https://cdn.nlark.com/yuque/0/2019/png/280374/1552996358352-assets/web-upload/cc3b1807-c684-4b83-8f80-80e5b8a6b975.png);
  background-size: cover;
  background-position: center;
  position: relative;
  z-index: 1;
}

.nav-li::after {
  content: '';
  position: absolute;
  z-index: -1;
  background-color: inherit;
  width: 100%;
  height: 100%;
  left: 0;
  bottom: -10%;
  border-radius: 10upx;
  opacity: 0.2;
  transform: scale(0.9, 0.9);
}

.nav-li.cur {
  color: #fff;
  background: rgb(94, 185, 94);
  box-shadow: 4upx 4upx 6upx rgba(94, 185, 94, 0.4);
}

.nav-title {
  font-size: 32upx;
  font-weight: 300;
}

.nav-title::first-letter {
  font-size: 40upx;
  margin-right: 4upx;
}

.nav-name {
  font-size: 28upx;
  text-transform: Capitalize;
  margin-top: 20upx;
  position: relative;
}

.nav-name::before {
  content: '';
  position: absolute;
  display: block;
  width: 40upx;
  height: 6upx;
  background: #fff;
  bottom: 0;
  right: 0;
  opacity: 0.5;
}

.nav-name::after {
  content: '';
  position: absolute;
  display: block;
  width: 100upx;
  height: 1px;
  background: #fff;
  bottom: 0;
  right: 40upx;
  opacity: 0.3;
}

.nav-name::first-letter {
  font-weight: bold;
  font-size: 36upx;
  margin-right: 1px;
}

.nav-li text {
  position: absolute;
  right: 30upx;
  top: 30upx;
  font-size: 52upx;
  width: 60upx;
  height: 60upx;
  text-align: center;
  line-height: 60upx;
}

.text-light {
  font-weight: 300;
}

@keyframes show {
  0% {
    transform: translateY(-50px);
  }

  60% {
    transform: translateY(40upx);
  }

  100% {
    transform: translateY(0px);
  }
}

@-webkit-keyframes show {
  0% {
    transform: translateY(-50px);
  }

  60% {
    transform: translateY(40upx);
  }

  100% {
    transform: translateY(0px);
  }
}
</style>
