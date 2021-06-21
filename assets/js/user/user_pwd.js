$(function() {
    var form = layui.form;

    // 表单验证
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function(val) {
            if (val === $('[name=oldPwd]').val()) {
                return '新旧密码不能一样'
            }
        },
        rePwd: function(val) {
            if (val !== $('[name=newPwd]').val()) {
                return '两次密码不一致,请重新输入'
            }
        }
    });

    // 提交修改密码请求
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('密码更新失败');
                }
                layui.layer.msg('密码更新成功');
                // 重置表单 reset()是原生对象 需要jq对象转换成原生对象
                $('.layui-form')[0].reset()
            }
        });
    });
});