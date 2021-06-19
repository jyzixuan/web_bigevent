//注意:每次调用 $.get() 或者 $.post() 或者$.ajax() 的时候会先调用 $.ajaxPerfilter()这个函数
//在这个函数中，可以拿到我们给ajax提供的配置对象

$.ajaxPrefilter(function(options) {
    //在发起真正的Ajax请求之前，统一凭借请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    console.log(options.url);

    // 统一为有权限的接口设置headers请求头
    //查找url里面有没有/my/的字符   indexOf!=-1就是有权限的接口
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || " "
        }
    };

    // 全局统一挂载 complete回调
    options.complete = function(res) {
        console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message == "身份认证失败！") {
            // 验证失败 1.强制清空token  2.强制跳转到登录
            localStorage.removeItem('token');
            location.href = '/login.html';
        }
    }

})