$(function () {
  // 调用函数 获取用户信息
  getUserInfo();

  var layer = layui.layer;

  // 绑定退出事件
  $('#btnLogout').on('click', function () {
    // 提示用户是否确认退出
    layer.confirm('确认退出登录?', { icon: 3, title: '提示' }, function (index) {
      //do something
      // 清空本地存储的token
      localStorage.removeItem('token');
      // 跳转到登录页面
      location.href = '/login.html';
      // 关闭询问框
      layer.close(index);
    });
  })
})

// 获取用户信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    success: function (res) {
      if (res.status != 0) {
        return layui.layer.msg('获取用户信息失败');
      }
      // 调用渲染用户头像函数
      renderAvatar(res.data);
    }
    // complete: function (res) {
    //   console.log('ok');
    //   // console.log(res);
    //   // 拿到服务器响应回来的数据
    //   // console.log(res.responseJSON);
    //   if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
    //     console.log('ok');
    //     // 强制清空token
    //     localStorage.removeItem('token');
    //     // 强制跳转到登录页面
    //     location.href = '/login.html';
    //   }
    // }
  })
}


// 渲染用户头像
function renderAvatar(user) {
  // 获取用户的名称
  var name = user.nickname || user.username;
  // 设置欢迎的文本
  $('#welcome').html('欢迎　' + name);

  // 按需渲染用户的头像
  if (user.user_pic !== null) {
    // 渲染图片头像
    $('.layui-nav-img').attr('src', user.user_pic).show();
    $('.text-avatar').hide();
  } else {
    // 渲染文本头像
    $('.layui-nav-img').hide();
    // 获取名称首字母转换成大写
    var first = name[0].toUpperCase();
    $('.text-avatar').html(first).show();
  }
}