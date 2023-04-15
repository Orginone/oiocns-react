import request from './MyRequest'


export function login(params:any) {  // 创建用户
    return request.post('/internal/login', params)
}

export function addssh(params:any) {  // 添加ssh
    return request.post('/internal/ssh/addssh', params)
}

export function repo_list(params:any) {  // 我的仓库列表
    return request.post('/internal/repo_list', params)
}
export function create_repo(params:any) {  // 添加仓库
    return request.post('/internal/create_repo', params)
}
export function all_repo_list(params:any) {  // 获取所有仓库（用户同步拉仓库）
    return request.post('/internal/all_repo_list', params)
}



