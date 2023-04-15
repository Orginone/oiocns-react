import axios from "axios"

const isDev = process.env.NODE_ENV === 'development' // 判断当前的运行环境的
const request =axios.create({
    baseURL:'',
    timeout:6000,
})

request.interceptors.request.use(
  (config) => {
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
request.interceptors.response.use(
  // response => {
  //   return response;
  // },
  // error => {
  //   return Promise.reject(error)
  // }
)





export default request
