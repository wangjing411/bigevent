$(function () {
  var form = layui.form;

  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6~12位, 且不能出现空格'],
    samePwd: function (value) {
      if (value === $('[name=oldPwd]').val()) {
        return '新旧密码不能相同';
      }
    },
    rePwd: function (value) {
      if (value !== $('[name=newPwd]').val()) {
        return '两次密码不一致';
      }
    }
  })

  $('.layui-form').on('submit', function (e) {
    // 阻止表单的默认提交行为
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg('修改密码失败');
        }

        layui.layer.msg('修改密码成功');
        // 重置表单
        $('.layui-form')[0].reset();
      }
    })
  })

  // 重置密码点击事件
  $('#btnReset').on('click', function () {
    $('.layui-form')[0].reset();
  });
})