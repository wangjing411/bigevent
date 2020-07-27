$(function () {
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;

  // 定义时间格式函数
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
  }

  // 定义补0函数
  function padZero(n) {
    return n > 9 ? n : '0' + n;
  }

  // 定义一个查询的参数对象, 将来请求数据的时候, 需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1,  // 页码值
    pagesize: 2,  // 显示几条数据
    cate_id: '',  // 分类文章的id
    state: ''  // 文章的发布状态
  }

  // 调用获取文章列表函数
  initTable();
  // 调用初始化文章分类的函数
  initCate();

  // 监听筛选表单的提交事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault();
    // 获取表单中选中项的值
    var cate_id = $('[name=cate_id]').val();
    var state = $('[name=state]').val();
    // 为查询参数对象去中对应的属性赋值
    q.cate_id = cate_id;
    q.state = state;
    // 根据最新的筛选条件, 重新渲染表格数据
    initTable();
  })

  // 请求文章列表数据函数
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        // console.log(res.data);
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败');
        }
        // 渲染数据
        var htmlStr = template('tpl-table', res);
        $('tbody').html(htmlStr);

        // 调用渲染分页的方法
        renderPage(res.total);
      }
    })
  }

  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败');
        }

        // 模板引擎渲染页面
        var htmlStr = template('tpl-cate', res);
        $('[name=cate_id]').html(htmlStr);
        // 通过layui重新渲染表单数据
        form.render();
      }
    })
  }

  // 定义渲染分页的方法
  function renderPage(total) {
    // 调用 laypage.render 方法来渲染分页的结构
    laypage.render({
      elem: 'pageBox',  // 分页容器的id，不用加 # 号
      count: total, //数据总数，从服务端得到
      limit: q.pagesize, // 每页显示几条数据
      curr: q.pagenum, // 默认被选中的页数
      layout: ['count', 'limit', 'prve', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      // 1. 点击分页切换时 触发的回调函数 first为true
      // 2. 调用laypage.render方法也会触发jump回调  first为undefined
      // 可以通过first的值 判断是通过哪种方式触发的函数
      // first 为true 证明是方式2触发的, 否则就是方式1触发的
      jump: function (obj, first) {
        // 把最新的条目数 赋值到q对象中
        q.pagesize = obj.limit;
        // 当前点击的页码值
        // console.log(obj.curr);
        q.pagenum = obj.curr;
        // 根据最新的q获取对应的数据列表 并渲染表格
        if (!first) {
          initTable();
        }
      }
    });
  }

  // 通过代理的形式, 为删除按钮绑定点击事件处理函数
  $('tbody').on('click', '#btn-del', function () {
    var id = $(this).attr('data-id');
    var len = $('.btn-del').length;
    console.log(len);
    // 询问用户是否需要删除数据
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败');
          }
          layer.msg('删除文章成功');
          // 当数据删除完成后 需要判断这一页中是否还有剩余的数据 如果没有数据 则让页码值 -1 之后 再重新调用initTable方法
          if (len === 1) {
            // 如果len等于1 说明删除完毕之后 页面上就没有任何数据了
            // 页码值最小必须是1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
          }
          // 调用获取文章列表函数
          initTable();
        }
      })
      // 关闭弹出层
      layer.close(index);
    });
  })
})