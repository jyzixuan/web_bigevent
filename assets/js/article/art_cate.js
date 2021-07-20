$(function() {

    var layer = layui.layer;
    var form = layui.form;
    // 获取文章分类的列表
    initArtCateList();

    function initArtCateList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                console.log(res);
                var thmlStr = template('tpl-table', res);
                $('tbody').html(thmlStr);
            }
        });
    }

    // 为添加类别添加点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        // 弹出层
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    });


    // 通过事件代理形式为form-add绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg('新增分类失败');
                }
                initArtCateList();
                layer.msg('新增分类成功');
                // 关闭弹出层
                layer.close(indexAdd); //传入开启弹出层时候的index
            }
        });
    });

    var indexEdit = null;
    // 通过代理形式为 btn-edit 绑定点击事件
    $('tbody').on('click', '#btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文字分类',
            content: $('#dialog-edit').html()
        });

        var id = $(this).attr('data-id');
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + id,
            success: function(res) {
                form.val('form-edit', res.data);
            }
        });
    });


    // 通过代理的形式为修改分类的按钮绑定 submit 事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类失败')
                }
                layer.msg('更新分类成功');
                layer.close(indexEdit);
                // 获取文章列表
                initArtCateList();
            }
        });
    });

    // 通过代理形式为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        console.log(id);
        // 提示用户是否删除 弹出框
        layer.confirm('确定要删除这条吗？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("删除失败");
                    }
                    layer.msg('删除成功');
                    layer.close(index);
                    initArtCateList();
                }
            });
        });

    });
});