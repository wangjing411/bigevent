$(function () {
  var form = layui.form;
  var layer = layui.layer;

  // 调用初始化列表函数
  initArtCateList();

  // 添加按钮绑定点击事件
  var indexAdd = null;
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      // 指定弹出层的类型
      type: 1,
      // 指定弹出层的宽和高
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html()
    });
  })

  // 通过代理的形式 监听添加表单的提交事件
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('新增分类失败');
        }
        // 重新调用初始化列表函数
        initArtCateList();
        layer.msg('新增分类成功');
        // 关闭弹出层
        layer.close(indexAdd);
      }
    })
  })

  // 通过代理的形式 为编辑按钮绑定点击事件
  var indexEdit = null;
  $('tbody').on('click', '#btn-edit', function () {
    indexEdit = layer.open({
      type: 1,
      // 指定弹出层的宽和高
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html()
    });

    var id = $(this).attr('data-id');
    // 发起请求
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        // 快速填充数据
        form.val('form-edit', res.data);
      }
    })
  })

  // 通过代理的形式  监听编辑表单的提交事件
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg('修改分类数据失败');
        }
        // 重新调用初始化列表函数
        initArtCateList();
        layer.msg('修改分类数据成功');
        // 关闭弹出层
        layer.close(indexEdit);
      }
    })
  })

  // 通过代理的形式 为删除按钮绑定点击事件
  $('tbody').on('click', '#btn-del', function () {
    var id = $(this).attr('data-id');
    // 提示框
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除分类失败');
          }
          // 重新调用初始化列表函数
          initArtCateList();
          layer.msg('删除分类成功');
          layer.close(index);
        }
      })
    });
  })


  // 获取文章分类的列表
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        // console.log(res);
        var htmlStr = template('tpl-table', res);
        $('tbody').html(htmlStr);
      }
    })
  }
})