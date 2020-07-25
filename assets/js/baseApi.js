// 每次发起请求的时候会先调用这个函数
// 在这个函数中, 可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
  // 再发起真正的ajax请求之前, 统一拼接请求的根路径
  options.url = 'http://ajax.frontend.itheima.net' + options.url;

  // 统一为有权限的接口, 设置请求头
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }

    // 统一设置complete回调函数
    options.complete = function (res) {
      // 拿到服务器响应回来的数据
      // console.log(res.responseJSON);
      if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        // 强制清空token
        localStorage.removeItem('token');
        // 强制跳转到登录页面
        location.href = '/login.html';
      }
    }
  }

})