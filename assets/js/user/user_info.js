$(function() {
    var form = layui.form;
    // layui的验证函数
    var layer = layui.layer;


    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '长度必须在1~6个字符之间'
            }
        }
    })


    initUserInfo();
    // 初始化初始化用户信息;
    function initUserInfo() {
        $.ajax({
            type: "GET",
            url: "/my/userinfo",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败');
                }
                console.log(res);
                // 调用from.val 快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        });
    }
    // 重置表单数据
    $('#btnReset').on('click', function(e) {
        e.preventDefault();
        initUserInfo();
    })

    // 监听表单提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/userinfo",
            // serialize() 表单序列化
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新数据失败');
                }
                layer.msg('更新数据成功');
                // 调用父页面中的方法重新渲染用户头像
                window.parent.getUserInfo();
            }
        });
    });
});