$(function() {
    //点击'去注册账号'的链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    //点击'去登录'的链接
    $('#link_login').on('click', function() {
        $('.reg-box').hide();
        $('.login-box').show();
    });

    //从layui 中获取 form 对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过form.verify() 函数来校验正则
    form.verify({
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一直
        repwd: function(value) {
            //通过形参拿到的是确认密码的内容
            //拿到密码框的输入值
            var pwd = $('.reg-box [name=password]').val();
            //然后进行一次等于比较
            if (pwd !== value) {
                return '两次密码不一致'
            }
            //如果判断失败,则return一个提示消息即可
        }
    });


    //监听注册表单提交事件
    $('#form_reg').on('submit', function(e) {
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        e.preventDefault();
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功');
            // 模拟点击行为 注册成功后自动返回登录界面
            $('#link_login').click();
        });
    });

    //监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/api/login",
            // $(this).serialize()快速获取表单数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('登录成功');
                // 登录成功后要跳转到主页
                // 将登录成功的token保存到localStrong中
                localStorage.setItem('token', res.token);
                // 跳转到后台主页
                location.href = '/index.html'
            }
        });
    });
})