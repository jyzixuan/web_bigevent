$(function() {

    getUserInfo();
    var layer = layui.layer;
    $('#btnLogout').on('click', function() {
        // 提示用户是否确认退出
        layer.confirm('确定退出登录吗？', {
            btn: ['确定', '取消']
        }, function() {
            // 确定退出 1.清除本地token 2.跳转到登录
            localStorage.removeItem('token');
            location.href = '/login.html';
            // layui自带关闭询问框
            layer.close();
        });
    });
});


// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: '/my/userinfo',
        // // Headers 就是请求头
        // headers: {
        //     Authorization: localStorage.getItem('token') || " "
        // },
        success: function(res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            //调用rendeAvatar()渲染用户头像
            // 注意这里要把返回的data传进去 定义函数的是才可以用user
            rendeAvatar(res.data);
        },
        // 不论成功失败都会执行complete回调函数
        // 在complete中要拿到服务器响应回来的数据要用 res.responesJOSN
        // complete: function(res) {
        //     console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message == "身份认证失败！") {
        //         // 验证失败 1.强制清空token  2.强制跳转到登录
        //         localStorage.removeItem('token');
        //         location.href = '/login.html';
        //     }
        // }
    });
}

function rendeAvatar(user) {
    // 获取用户的昵称
    var name = user.nickname || user.username;
    // 设置欢迎的文本
    $('#welcome').html('欢迎  ' + name);

    // 判断用户有无图片头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 宣传文本头像
        $('.layui-nav-img').hide();
        // 获取字符串第一个字符
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}