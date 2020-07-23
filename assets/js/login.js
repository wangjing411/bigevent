$(function () {
  // 点击去注册账号的链接
  $('#link_reg').on('click', function () {
    $('.login-box').hide();
    $('.reg-box').show();
  })

  // 点击去登录的链接
  $('#link_login').on('click', function () {
    $('.login-box').show();
    $('.reg-box').hide();
  })

  // 从layui中获取form对象(一定要引入layui的js文件)
  var form = layui.form;
  var layer = layui.layer;
  // 通过form.verify()自定义校验规则
  form.verify({
    // 用户名的校验规则
    uname: [/^[\w]{6,12}$/, '用户名必须是数字,字母,下划线, 且是6到12位'],
    // 自定义了一个叫做pwd的校验规则
    pwd: [/^[\S]{6,12}$/, '密码必须是6到12位, 且不能有空格'],
    // 校验两次是否一致的规则
    repwd: function (value) {
      // value --->  确认密码框中的内容
      // 通过形参拿到的是确认密码框中的内容
      // 还需要拿到密码框中的内容 进行判断
      // 获取密码框中的内容
      var pwd = $('.reg-box [name=password').val();
      // 判断两次密码是否一致
      if (pwd != value) {
        // 不一致 返回提示信息
        return '两次密码不一致';
      }
    }
  })

  // 监听注册表单的提交事件
  $('#form_reg').on('submit', function (e) {
    // 阻止默认行为
    e.preventDefault();
    var data = {
      username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val()
    };
    $.post('/api/reguser', data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      layer.msg('注册成功, 请登录');
      // 模拟人的点击行为
      $('#link_login').click();
    })
  })

  // 监听登录表单的提交事件
  $('#form_login').submit(function (e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/api/login',
      // 快速获取表单数据
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('登录失败');
        }
        layer.msg('登陆成功');
        // 将登录成功得到的 token字符串, 保存到localStorage 中
        localStorage.setItem('token', res.token);
        // 跳转到首页
        location.href = '/index.html';
      }
    })
  })
})
// https://www.showdoc.cc/escook?page_id=3707158761215217
// http://ajax.frontend.itheima.net
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mjc4NCwidXNlcm5hbWUiOiJhZG1pbjQiLCJwYXNzd29yZCI6IiIsIm5pY2tuYW1lIjoiIiwiZW1haWwiOiIiLCJ1c2VyX3BpYyI6IiIsImlhdCI6MTU5NTQ4ODg1NywiZXhwIjoxNTk1NTI0ODU3fQ.2weVjgEnx8Tp8e3h_g2KjpWKfAQssWlyPp4qy3y4oDk