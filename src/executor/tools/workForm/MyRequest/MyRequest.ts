import axios from "axios"

const isDev = process.env.NODE_ENV === 'development' // 判断当前的运行环境的
const gogsRequest =axios.create({ //gogos
    baseURL:'',
    timeout:6000,
})

gogsRequest.interceptors.request.use(
  (config:any) => {
    config.headers = {
      'Content-Type':'application/x-www-form-urlencoded'
    }
    config.headers['token']='7c49b153d4b59f8c0cf8c3e18dc80cb7'
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);


//http response 拦截器
gogsRequest.interceptors.response.use(
  // response => {
  //   return response;
  // },
  // error => {
  //   return Promise.reject(error)
  // }
)

const kubevelaRequest =axios.create({ //kubevela
  baseURL:'',
  timeout:6000,
})

kubevelaRequest.interceptors.request.use(
// (config:any) => {
//   config.headers = {
//     'Content-Type':'application/json'
//   }
//   return config;
// },
// error => {
//   return Promise.reject(error);
// }
);


//http response 拦截器
kubevelaRequest.interceptors.response.use(
// response => {
//   return response;
// },
// error => {
//   return Promise.reject(error)
// }
)



export {gogsRequest,kubevelaRequest}
