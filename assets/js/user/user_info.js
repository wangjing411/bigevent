$(function () {
  var form = layui.form;
  var layer = layui.layer;

  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度必须在1~6个字符之间'
      }
    }
  })

  // 调用初始化用户的基本信息函数
  initUserInfo();

  // 重置按钮绑定点击事件
  $('#btnReset').on('click', function (e) {
    // 阻止表单的默认重置行为
    e.preventDefault();
    // 调用初始化用户信息函数
    initUserInfo();
  })

  // 监听表单的提交事件
  $('.layui-form').on('submit', function (e) {
    // 阻止表单的默认提交行为
    e.preventDefault();
    // 发起请求
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      // 快速获取表单数据
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('修改用户信息失败');
        }
        layer.msg('修改用户信息成功');
        // 调用父页面index的方法 重新渲染头像和用户名
        window.parent.getUserInfo();
      }
    })
  })

  // 初始化用户的基本信息
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取用户信息失败');
        }
        // console.log(res);
        // 调用form.val快速为表单赋值
        form.val('formUserInfo', res.data);
      }
    })
  }
})