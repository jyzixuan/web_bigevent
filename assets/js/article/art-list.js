$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义美化时间的过滤器;
    template.defaults.imports.dataFormat = function(data) {
        const dt = new Date(data);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    };
    // 定义补0函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    // 定义一个查询的参数对象,将来请求数据的时候;
    // 需要把请求参数发送到服务器;
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少数据值
        cate_id: '', //文章的id值
        state: '' //文章的状态值
    };
    initTable();
    initCate();


    // 获取文章列表方法
    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                console.log(res);
                // 使用模板引擎渲染页面
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 渲染分页
                renderPage(res.total);
            }
        });
    };

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类失败');
                }
                // 调用模板引擎宣传分类选项
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 通知layui重新生成表单区的UI结构 
                // 动态生成就需要重新渲染一次
                form.render();
            }
        });
    }

    // 为筛选表单绑定 submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        // 获取表单中选中的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();

        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;

        // 根据最新的筛选条件，重新渲染数据
        initTable();
    });


    // 定义渲染分页的方法;
    function renderPage(total) {
        // 调用 laypage.render() 初始化分页
        laypage.render({
            elem: 'pageBox', //注意，这里的是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几天数据
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //功能配置
            limits: [2, 4, 6, 8, 10],
            //默认选中页数
            // 触发jump的回调方式有两种 1点击 2调用laypage.render()
            jump: function(obj, first) {
                // 可以通过判断first来判断是通过那种方式触发的jump
                // first=ture 是调用 laypage.render()触发
                // first=unfind
                // 把最新的页码值赋值到q查询参数里
                q.pagenum = obj.curr;
                // 把最新的条目数赋值到pageSize上
                q.pagesize = obj.limit;
                //根据最新的q获取的数据列表，重新渲染页面
                // 但是这里直接调用会死循环  原因看100行
                // initTable();
                if (!first) {
                    initTable();
                }
            }
        });
    }

    // 通过代理的方式为删除按钮添加点击事件
    $('tobody').on('clik', 'btn-delete', function() {

        var len = $('.btn-delete').length;
        // console.log(len);

        // 获取文章的id
        var id = $(this).attr('data-id');
        layer.confirm('确定要删除这条吗？', { btn: ['删除', '取消'] }, function(index) {
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + id,
                data: "data",
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg('删除成功');
                    // 当数据删除完成后，需要判断这一页中是否还剩余的数据
                    // 如果没有数据，则让页码值 -1 之后  重新调用 initTable()方法
                    if (len === 1) {
                        // 如果len等于1 那就说明页面上只有一个删除按钮了 
                        // 如果len等于1 如果删除完毕只有，页面上就没有数据了

                        // 注意页码值最小要等于1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            });
            layer.close(index);
        });
    });
});