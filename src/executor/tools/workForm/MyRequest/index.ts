import { kubevelaRequest,gogsRequest } from "./MyRequest";
import axios from "axios";

//gogs
export function login(params:any) {  // 创建用户
    return gogsRequest.post('/internal/internal/login', params)
}

export function addssh(params:any) {  // 添加ssh
    return gogsRequest.post('/internal/internal/ssh/addssh', params)
}

export function repo_list(params:any) {  // 我的仓库列表
    return gogsRequest.post('/internal/internal/repo_list', params)
}
export function create_repo(params:any) {  // 添加仓库
    return gogsRequest.post('/internal/internal/create_repo', params)
}
export function all_repo_list(params:any) {  // 获取所有仓库（用户同步拉仓库）
    return gogsRequest.post('/internal/internal/all_repo_list', params)
}
export function webhooks(params:any) {  // 设置webhooks
    const url = `/internal/repos/445654954863104000/` + `${params.username}/${params.reponame}`+"/hooks"
    console.log(url);
    
    const data={
        "type": "gogs",
        "config": {
            "url": "http://101.43.92.168:8080/scmsynchook",
            "content_type": "json"
        },
        "events": [
            "create",
            "delete",
            "fork",
            "push",
        ],
        "active": true
    }
    return axios.post(url, data)
}
//kubevela
export function kubevelaLogin(params:any) {  // 登录
    return kubevelaRequest.post('/kubevela/api/v1/auth/login', params)
}

export function kubeveUser_info(paramss:any,token:any) {  // 获取项目类型
    
    return kubevelaRequest.get('/kubevela/api/v1/auth/user_info', {
        params: {
          ...paramss
        },
        headers: {
          Authorization: 'Bearer '+token
        }
      })
}
export function kubeveDefinitions(paramss:any,token:any) {  // 获取主组件类型
    
    return kubevelaRequest.get('/kubevela/api/v1/definitions', {
        params: {
          ...paramss,
          type:'component'
        },
        headers: {
          Authorization: 'Bearer '+token
        }
      })
}
interface Envs {
    project:string, // 项目类型值
    page:number  //分页
}
export function kubeveEnvs(paramss:Envs,token:any) {  // 获取绑定环境
    
    return kubevelaRequest.get('/kubevela/api/v1/envs', {
        params: {
          ...paramss
        },
        headers: {
          Authorization: 'Bearer '+token
        }
      })
}
  /**
   * 选择主组件类型，去获取对应第二页的信息
   * @param paramss 参数
   * @param token 参数
   * @param p 主组件值
   * @returns 返回结果
   */
export function kubeveDefin(paramss:any,token:any,p:any) {
    
    return kubevelaRequest.get('/kubevela/api/v1/definitions/'+p, {
        params: {
          ...paramss,
          type:'component'
        },
        headers: {
          Authorization: 'Bearer '+token
        }
      })
}

/**
 * 获取项目列表
 * @param paramss 参数
 * @param token 参数
 * @returns 返回结果
 */
export function kubeveList(paramss:any,token:any) {
  
  return kubevelaRequest.get('/kubevela/api/v1/applications', {
      params: {
        ...paramss,
        project:'default'
      },
      headers: {
        Authorization: 'Bearer '+token
      }
    })
}

/**
 * 发布应用
 * @param paramss 参数
 * @param token 参数
 * @returns 返回结果
 */
export function kubeveIssue(data:any,token:any) {
  
    return kubevelaRequest.post('/kubevela/api/v1/applications',data,{
        params: {
            project:'default'
          },
          headers: {
            'Authorization': `Bearer ${token}`
          }
          
      } )
    // kubevelaRequest.post('/kubevela/api/v1/applications', {
    //     params: {
    //       project:'default'
    //     },
    //     data:{
    //         ...paramss,
    //     },
    //     headers: {
    //       Authorization: 'Bearer '+token
    //     }
    //   })
      
  }

const a={
    "name": "task",
    "alias": "",
    "description": "Describes jobs that run code or a script to completion.",
    "icon": "",
    "status": "enable",
    "labels": {
        "app.kubernetes.io/managed-by": "Helm"
    },
    "workloadType": "jobs.batch",
    "ownerAddon": "",
    "component": {
        "workload": {
            "type": "jobs.batch",
            "definition": {
                "apiVersion": "batch/v1",
                "kind": "Job"
            }
        },
        "status": {
            "customStatus": "status: {\n\tactive:    *0 | int\n\tfailed:    *0 | int\n\tsucceeded: *0 | int\n} & {\n\tif context.output.status.active != _|_ {\n\t\tactive: context.output.status.active\n\t}\n\tif context.output.status.failed != _|_ {\n\t\tfailed: context.output.status.failed\n\t}\n\tif context.output.status.succeeded != _|_ {\n\t\tsucceeded: context.output.status.succeeded\n\t}\n}\nmessage: \"Active/Failed/Succeeded:\\(status.active)/\\(status.failed)/\\(status.succeeded)\"",
            "healthPolicy": "succeeded: *0 | int\nif context.output.status.succeeded != _|_ {\n\tsucceeded: context.output.status.succeeded\n}\nisHealth: succeeded == context.output.spec.parallelism"
        },
        "schematic": {
            "cue": {
                "template": "output: {\n\tapiVersion: \"batch/v1\"\n\tkind:       \"Job\"\n\tspec: {\n\t\tparallelism: parameter.count\n\t\tcompletions: parameter.count\n\t\ttemplate: {\n\t\t\tmetadata: {\n\t\t\t\tlabels: {\n\t\t\t\t\tif parameter.labels != _|_ {\n\t\t\t\t\t\tparameter.labels\n\t\t\t\t\t}\n\t\t\t\t\t\"app.oam.dev/name\":      context.appName\n\t\t\t\t\t\"app.oam.dev/component\": context.name\n\t\t\t\t}\n\t\t\t\tif parameter.annotations != _|_ {\n\t\t\t\t\tannotations: parameter.annotations\n\t\t\t\t}\n\t\t\t}\n\t\t\tspec: {\n\t\t\t\trestartPolicy: parameter.restart\n\t\t\t\tcontainers: [{\n\t\t\t\t\tname:  context.name\n\t\t\t\t\timage: parameter.image\n\n\t\t\t\t\tif parameter[\"imagePullPolicy\"] != _|_ {\n\t\t\t\t\t\timagePullPolicy: parameter.imagePullPolicy\n\t\t\t\t\t}\n\n\t\t\t\t\tif parameter[\"cmd\"] != _|_ {\n\t\t\t\t\t\tcommand: parameter.cmd\n\t\t\t\t\t}\n\n\t\t\t\t\tif parameter[\"env\"] != _|_ {\n\t\t\t\t\t\tenv: parameter.env\n\t\t\t\t\t}\n\n\t\t\t\t\tif parameter[\"cpu\"] != _|_ {\n\t\t\t\t\t\tresources: {\n\t\t\t\t\t\t\tlimits: cpu:   parameter.cpu\n\t\t\t\t\t\t\trequests: cpu: parameter.cpu\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\n\t\t\t\t\tif parameter[\"memory\"] != _|_ {\n\t\t\t\t\t\tresources: {\n\t\t\t\t\t\t\tlimits: memory:   parameter.memory\n\t\t\t\t\t\t\trequests: memory: parameter.memory\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\n\t\t\t\t\tif parameter[\"volumes\"] != _|_ {\n\t\t\t\t\t\tvolumeMounts: [ for v in parameter.volumes {\n\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\tmountPath: v.mountPath\n\t\t\t\t\t\t\t\tname:      v.name\n\t\t\t\t\t\t\t}}]\n\t\t\t\t\t}\n\t\t\t\t}]\n\n\t\t\t\tif parameter[\"volumes\"] != _|_ {\n\t\t\t\t\tvolumes: [ for v in parameter.volumes {\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\tname: v.name\n\t\t\t\t\t\t\tif v.type == \"pvc\" {\n\t\t\t\t\t\t\t\tpersistentVolumeClaim: claimName: v.claimName\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\tif v.type == \"configMap\" {\n\t\t\t\t\t\t\t\tconfigMap: {\n\t\t\t\t\t\t\t\t\tdefaultMode: v.defaultMode\n\t\t\t\t\t\t\t\t\tname:        v.cmName\n\t\t\t\t\t\t\t\t\tif v.items != _|_ {\n\t\t\t\t\t\t\t\t\t\titems: v.items\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\tif v.type == \"secret\" {\n\t\t\t\t\t\t\t\tsecret: {\n\t\t\t\t\t\t\t\t\tdefaultMode: v.defaultMode\n\t\t\t\t\t\t\t\t\tsecretName:  v.secretName\n\t\t\t\t\t\t\t\t\tif v.items != _|_ {\n\t\t\t\t\t\t\t\t\t\titems: v.items\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\tif v.type == \"emptyDir\" {\n\t\t\t\t\t\t\t\temptyDir: medium: v.medium\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}}]\n\t\t\t\t}\n\n\t\t\t\tif parameter[\"imagePullSecrets\"] != _|_ {\n\t\t\t\t\timagePullSecrets: [ for v in parameter.imagePullSecrets {\n\t\t\t\t\t\tname: v\n\t\t\t\t\t},\n\t\t\t\t\t]\n\t\t\t\t}\n\n\t\t\t}\n\t\t}\n\t}\n}\nparameter: {\n\t// +usage=Specify the labels in the workload\n\tlabels?: [string]: string\n\n\t// +usage=Specify the annotations in the workload\n\tannotations?: [string]: string\n\n\t// +usage=Specify number of tasks to run in parallel\n\t// +short=c\n\tcount: *1 | int\n\n\t// +usage=Which image would you like to use for your service\n\t// +short=i\n\timage: string\n\n\t// +usage=Specify image pull policy for your service\n\timagePullPolicy?: \"Always\" | \"Never\" | \"IfNotPresent\"\n\n\t// +usage=Specify image pull secrets for your service\n\timagePullSecrets?: [...string]\n\n\t// +usage=Define the job restart policy, the value can only be Never or OnFailure. By default, it's Never.\n\trestart: *\"Never\" | string\n\n\t// +usage=Commands to run in the container\n\tcmd?: [...string]\n\n\t// +usage=Define arguments by using environment variables\n\tenv?: [...{\n\t\t// +usage=Environment variable name\n\t\tname: string\n\t\t// +usage=The value of the environment variable\n\t\tvalue?: string\n\t\t// +usage=Specifies a source the value of this var should come from\n\t\tvalueFrom?: {\n\t\t\t// +usage=Selects a key of a secret in the pod's namespace\n\t\t\tsecretKeyRef?: {\n\t\t\t\t// +usage=The name of the secret in the pod's namespace to select from\n\t\t\t\tname: string\n\t\t\t\t// +usage=The key of the secret to select from. Must be a valid secret key\n\t\t\t\tkey: string\n\t\t\t}\n\t\t\t// +usage=Selects a key of a config map in the pod's namespace\n\t\t\tconfigMapKeyRef?: {\n\t\t\t\t// +usage=The name of the config map in the pod's namespace to select from\n\t\t\t\tname: string\n\t\t\t\t// +usage=The key of the config map to select from. Must be a valid secret key\n\t\t\t\tkey: string\n\t\t\t}\n\t\t}\n\t}]\n\n\t// +usage=Number of CPU units for the service, like `0.5` (0.5 CPU core), `1` (1 CPU core)\n\tcpu?: string\n\n\t// +usage=Specifies the attributes of the memory resource required for the container.\n\tmemory?: string\n\n\t// +usage=Declare volumes and volumeMounts\n\tvolumes?: [...{\n\t\tname:      string\n\t\tmountPath: string\n\t\t// +usage=Specify volume type, options: \"pvc\",\"configMap\",\"secret\",\"emptyDir\", default to emptyDir\n\t\ttype: *\"emptyDir\" | \"pvc\" | \"configMap\" | \"secret\"\n\t\tif type == \"pvc\" {\n\t\t\tclaimName: string\n\t\t}\n\t\tif type == \"configMap\" {\n\t\t\tdefaultMode: *420 | int\n\t\t\tcmName:      string\n\t\t\titems?: [...{\n\t\t\t\tkey:  string\n\t\t\t\tpath: string\n\t\t\t\tmode: *511 | int\n\t\t\t}]\n\t\t}\n\t\tif type == \"secret\" {\n\t\t\tdefaultMode: *420 | int\n\t\t\tsecretName:  string\n\t\t\titems?: [...{\n\t\t\t\tkey:  string\n\t\t\t\tpath: string\n\t\t\t\tmode: *511 | int\n\t\t\t}]\n\t\t}\n\t\tif type == \"emptyDir\" {\n\t\t\tmedium: *\"\" | \"Memory\"\n\t\t}\n\t}]\n\n\t// +usage=Instructions for assessing whether the container is alive.\n\tlivenessProbe?: #HealthProbe\n\n\t// +usage=Instructions for assessing whether the container is in a suitable state to serve traffic.\n\treadinessProbe?: #HealthProbe\n}\n#HealthProbe: {\n\n\t// +usage=Instructions for assessing container health by executing a command. Either this attribute or the httpGet attribute or the tcpSocket attribute MUST be specified. This attribute is mutually exclusive with both the httpGet attribute and the tcpSocket attribute.\n\texec?: {\n\t\t// +usage=A command to be executed inside the container to assess its health. Each space delimited token of the command is a separate array element. Commands exiting 0 are considered to be successful probes, whilst all other exit codes are considered failures.\n\t\tcommand: [...string]\n\t}\n\n\t// +usage=Instructions for assessing container health by executing an HTTP GET request. Either this attribute or the exec attribute or the tcpSocket attribute MUST be specified. This attribute is mutually exclusive with both the exec attribute and the tcpSocket attribute.\n\thttpGet?: {\n\t\t// +usage=The endpoint, relative to the port, to which the HTTP GET request should be directed.\n\t\tpath: string\n\t\t// +usage=The TCP socket within the container to which the HTTP GET request should be directed.\n\t\tport: int\n\t\thttpHeaders?: [...{\n\t\t\tname:  string\n\t\t\tvalue: string\n\t\t}]\n\t}\n\n\t// +usage=Instructions for assessing container health by probing a TCP socket. Either this attribute or the exec attribute or the httpGet attribute MUST be specified. This attribute is mutually exclusive with both the exec attribute and the httpGet attribute.\n\ttcpSocket?: {\n\t\t// +usage=The TCP socket within the container that should be probed to assess container health.\n\t\tport: int\n\t}\n\n\t// +usage=Number of seconds after the container is started before the first probe is initiated.\n\tinitialDelaySeconds: *0 | int\n\n\t// +usage=How often, in seconds, to execute the probe.\n\tperiodSeconds: *10 | int\n\n\t// +usage=Number of seconds after which the probe times out.\n\ttimeoutSeconds: *1 | int\n\n\t// +usage=Minimum consecutive successes for the probe to be considered successful after having failed.\n\tsuccessThreshold: *1 | int\n\n\t// +usage=Number of consecutive failures required to determine the container is not alive (liveness probe) or not ready (readiness probe).\n\tfailureThreshold: *3 | int\n}\n"
            }
        }
    },
    "schema": {
        "properties": {
            "annotations": {
                "additionalProperties": {
                    "type": "string"
                },
                "description": "Specify the annotations in the workload",
                "title": "annotations",
                "type": "object"
            },
            "cmd": {
                "description": "Commands to run in the container",
                "items": {
                    "type": "string"
                },
                "title": "cmd",
                "type": "array"
            },
            "count": {
                "default": 1,
                "description": "Specify number of tasks to run in parallel",
                "title": "count",
                "type": "integer"
            },
            "cpu": {
                "description": "Number of CPU units for the service, like `0.5` (0.5 CPU core), `1` (1 CPU core)",
                "title": "cpu",
                "type": "string"
            },
            "env": {
                "description": "Define arguments by using environment variables",
                "items": {
                    "properties": {
                        "name": {
                            "description": "Environment variable name",
                            "title": "name",
                            "type": "string"
                        },
                        "value": {
                            "description": "The value of the environment variable",
                            "title": "value",
                            "type": "string"
                        },
                        "valueFrom": {
                            "description": "Specifies a source the value of this var should come from",
                            "properties": {
                                "configMapKeyRef": {
                                    "description": "Selects a key of a config map in the pod's namespace",
                                    "properties": {
                                        "key": {
                                            "description": "The key of the config map to select from. Must be a valid secret key",
                                            "title": "key",
                                            "type": "string"
                                        },
                                        "name": {
                                            "description": "The name of the config map in the pod's namespace to select from",
                                            "title": "name",
                                            "type": "string"
                                        }
                                    },
                                    "required": [
                                        "name",
                                        "key"
                                    ],
                                    "title": "configMapKeyRef",
                                    "type": "object"
                                },
                                "secretKeyRef": {
                                    "description": "Selects a key of a secret in the pod's namespace",
                                    "properties": {
                                        "key": {
                                            "description": "The key of the secret to select from. Must be a valid secret key",
                                            "title": "key",
                                            "type": "string"
                                        },
                                        "name": {
                                            "description": "The name of the secret in the pod's namespace to select from",
                                            "title": "name",
                                            "type": "string"
                                        }
                                    },
                                    "required": [
                                        "name",
                                        "key"
                                    ],
                                    "title": "secretKeyRef",
                                    "type": "object"
                                }
                            },
                            "title": "valueFrom",
                            "type": "object"
                        }
                    },
                    "required": [
                        "name"
                    ],
                    "type": "object"
                },
                "title": "env",
                "type": "array"
            },
            "image": {
                "description": "Which image would you like to use for your service",
                "title": "image",
                "type": "string"
            },
            "imagePullPolicy": {
                "description": "Specify image pull policy for your service",
                "enum": [
                    "Always",
                    "Never",
                    "IfNotPresent"
                ],
                "title": "imagePullPolicy",
                "type": "string"
            },
            "imagePullSecrets": {
                "description": "Specify image pull secrets for your service",
                "items": {
                    "type": "string"
                },
                "title": "imagePullSecrets",
                "type": "array"
            },
            "labels": {
                "additionalProperties": {
                    "type": "string"
                },
                "description": "Specify the labels in the workload",
                "title": "labels",
                "type": "object"
            },
            "livenessProbe": {
                "description": "Instructions for assessing whether the container is alive.",
                "properties": {
                    "exec": {
                        "description": "Instructions for assessing container health by executing a command. Either this attribute or the httpGet attribute or the tcpSocket attribute MUST be specified. This attribute is mutually exclusive with both the httpGet attribute and the tcpSocket attribute.",
                        "properties": {
                            "command": {
                                "description": "A command to be executed inside the container to assess its health. Each space delimited token of the command is a separate array element. Commands exiting 0 are considered to be successful probes, whilst all other exit codes are considered failures.",
                                "items": {
                                    "type": "string"
                                },
                                "title": "command",
                                "type": "array"
                            }
                        },
                        "required": [
                            "command"
                        ],
                        "title": "exec",
                        "type": "object"
                    },
                    "failureThreshold": {
                        "default": 3,
                        "description": "Number of consecutive failures required to determine the container is not alive (liveness probe) or not ready (readiness probe).",
                        "title": "failureThreshold",
                        "type": "integer"
                    },
                    "httpGet": {
                        "description": "Instructions for assessing container health by executing an HTTP GET request. Either this attribute or the exec attribute or the tcpSocket attribute MUST be specified. This attribute is mutually exclusive with both the exec attribute and the tcpSocket attribute.",
                        "properties": {
                            "httpHeaders": {
                                "items": {
                                    "properties": {
                                        "name": {
                                            "title": "name",
                                            "type": "string"
                                        },
                                        "value": {
                                            "title": "value",
                                            "type": "string"
                                        }
                                    },
                                    "required": [
                                        "name",
                                        "value"
                                    ],
                                    "type": "object"
                                },
                                "title": "httpHeaders",
                                "type": "array"
                            },
                            "path": {
                                "description": "The endpoint, relative to the port, to which the HTTP GET request should be directed.",
                                "title": "path",
                                "type": "string"
                            },
                            "port": {
                                "description": "The TCP socket within the container to which the HTTP GET request should be directed.",
                                "title": "port",
                                "type": "integer"
                            }
                        },
                        "required": [
                            "path",
                            "port"
                        ],
                        "title": "httpGet",
                        "type": "object"
                    },
                    "initialDelaySeconds": {
                        "default": 0,
                        "description": "Number of seconds after the container is started before the first probe is initiated.",
                        "title": "initialDelaySeconds",
                        "type": "integer"
                    },
                    "periodSeconds": {
                        "default": 10,
                        "description": "How often, in seconds, to execute the probe.",
                        "title": "periodSeconds",
                        "type": "integer"
                    },
                    "successThreshold": {
                        "default": 1,
                        "description": "Minimum consecutive successes for the probe to be considered successful after having failed.",
                        "title": "successThreshold",
                        "type": "integer"
                    },
                    "tcpSocket": {
                        "description": "Instructions for assessing container health by probing a TCP socket. Either this attribute or the exec attribute or the httpGet attribute MUST be specified. This attribute is mutually exclusive with both the exec attribute and the httpGet attribute.",
                        "properties": {
                            "port": {
                                "description": "The TCP socket within the container that should be probed to assess container health.",
                                "title": "port",
                                "type": "integer"
                            }
                        },
                        "required": [
                            "port"
                        ],
                        "title": "tcpSocket",
                        "type": "object"
                    },
                    "timeoutSeconds": {
                        "default": 1,
                        "description": "Number of seconds after which the probe times out.",
                        "title": "timeoutSeconds",
                        "type": "integer"
                    }
                },
                "required": [
                    "initialDelaySeconds",
                    "periodSeconds",
                    "timeoutSeconds",
                    "successThreshold",
                    "failureThreshold"
                ],
                "title": "livenessProbe",
                "type": "object"
            },
            "memory": {
                "description": "Specifies the attributes of the memory resource required for the container.",
                "title": "memory",
                "type": "string"
            },
            "readinessProbe": {
                "description": "Instructions for assessing whether the container is in a suitable state to serve traffic.",
                "properties": {
                    "exec": {
                        "description": "Instructions for assessing container health by executing a command. Either this attribute or the httpGet attribute or the tcpSocket attribute MUST be specified. This attribute is mutually exclusive with both the httpGet attribute and the tcpSocket attribute.",
                        "properties": {
                            "command": {
                                "description": "A command to be executed inside the container to assess its health. Each space delimited token of the command is a separate array element. Commands exiting 0 are considered to be successful probes, whilst all other exit codes are considered failures.",
                                "items": {
                                    "type": "string"
                                },
                                "title": "command",
                                "type": "array"
                            }
                        },
                        "required": [
                            "command"
                        ],
                        "title": "exec",
                        "type": "object"
                    },
                    "failureThreshold": {
                        "default": 3,
                        "description": "Number of consecutive failures required to determine the container is not alive (liveness probe) or not ready (readiness probe).",
                        "title": "failureThreshold",
                        "type": "integer"
                    },
                    "httpGet": {
                        "description": "Instructions for assessing container health by executing an HTTP GET request. Either this attribute or the exec attribute or the tcpSocket attribute MUST be specified. This attribute is mutually exclusive with both the exec attribute and the tcpSocket attribute.",
                        "properties": {
                            "httpHeaders": {
                                "items": {
                                    "properties": {
                                        "name": {
                                            "title": "name",
                                            "type": "string"
                                        },
                                        "value": {
                                            "title": "value",
                                            "type": "string"
                                        }
                                    },
                                    "required": [
                                        "name",
                                        "value"
                                    ],
                                    "type": "object"
                                },
                                "title": "httpHeaders",
                                "type": "array"
                            },
                            "path": {
                                "description": "The endpoint, relative to the port, to which the HTTP GET request should be directed.",
                                "title": "path",
                                "type": "string"
                            },
                            "port": {
                                "description": "The TCP socket within the container to which the HTTP GET request should be directed.",
                                "title": "port",
                                "type": "integer"
                            }
                        },
                        "required": [
                            "path",
                            "port"
                        ],
                        "title": "httpGet",
                        "type": "object"
                    },
                    "initialDelaySeconds": {
                        "default": 0,
                        "description": "Number of seconds after the container is started before the first probe is initiated.",
                        "title": "initialDelaySeconds",
                        "type": "integer"
                    },
                    "periodSeconds": {
                        "default": 10,
                        "description": "How often, in seconds, to execute the probe.",
                        "title": "periodSeconds",
                        "type": "integer"
                    },
                    "successThreshold": {
                        "default": 1,
                        "description": "Minimum consecutive successes for the probe to be considered successful after having failed.",
                        "title": "successThreshold",
                        "type": "integer"
                    },
                    "tcpSocket": {
                        "description": "Instructions for assessing container health by probing a TCP socket. Either this attribute or the exec attribute or the httpGet attribute MUST be specified. This attribute is mutually exclusive with both the exec attribute and the httpGet attribute.",
                        "properties": {
                            "port": {
                                "description": "The TCP socket within the container that should be probed to assess container health.",
                                "title": "port",
                                "type": "integer"
                            }
                        },
                        "required": [
                            "port"
                        ],
                        "title": "tcpSocket",
                        "type": "object"
                    },
                    "timeoutSeconds": {
                        "default": 1,
                        "description": "Number of seconds after which the probe times out.",
                        "title": "timeoutSeconds",
                        "type": "integer"
                    }
                },
                "required": [
                    "initialDelaySeconds",
                    "periodSeconds",
                    "timeoutSeconds",
                    "successThreshold",
                    "failureThreshold"
                ],
                "title": "readinessProbe",
                "type": "object"
            },
            "restart": {
                "default": "Never",
                "description": "Define the job restart policy, the value can only be Never or OnFailure. By default, it's Never.",
                "title": "restart",
                "type": "string"
            },
            "volumes": {
                "description": "Declare volumes and volumeMounts",
                "items": {
                    "properties": {
                        "medium": {
                            "default": "",
                            "enum": [
                                "",
                                "Memory",
                                "Memory"
                            ],
                            "title": "medium",
                            "type": "string"
                        },
                        "mountPath": {
                            "title": "mountPath",
                            "type": "string"
                        },
                        "name": {
                            "title": "name",
                            "type": "string"
                        },
                        "type": {
                            "default": "emptyDir",
                            "description": "Specify volume type, options: \"pvc\",\"configMap\",\"secret\",\"emptyDir\", default to emptyDir",
                            "enum": [
                                "emptyDir",
                                "pvc",
                                "configMap",
                                "secret"
                            ],
                            "title": "type",
                            "type": "string"
                        }
                    },
                    "required": [
                        "name",
                        "mountPath",
                        "medium",
                        "type"
                    ],
                    "type": "object"
                },
                "title": "volumes",
                "type": "array"
            }
        },
        "required": [
            "count",
            "image",
            "restart"
        ],
        "type": "object"
    },
    "uiSchema": [
        {
            "sort": 1,
            "label": "Image",
            "description": "Which image would you like to use for your service",
            "validate": {
                "required": true,
                "immutable": false
            },
            "jsonKey": "image",
            "uiType": "ImageInput"
        },
        {
            "sort": 3,
            "label": "Restart",
            "description": "Define the job restart policy, the value can only be Never or OnFailure. By default, it's Never.",
            "validate": {
                "required": true,
                "options": [
                    {
                        "label": "Never",
                        "value": "Never"
                    },
                    {
                        "label": "OnFailure",
                        "value": "OnFailure"
                    }
                ],
                "defaultValue": "Never",
                "immutable": false
            },
            "jsonKey": "restart",
            "uiType": "Select"
        },
        {
            "sort": 4,
            "label": "Count",
            "description": "Specify number of tasks to run in parallel",
            "validate": {
                "required": true,
                "max": 128,
                "min": 0,
                "defaultValue": 1,
                "immutable": false
            },
            "jsonKey": "count",
            "uiType": "Number"
        },
        {
            "sort": 5,
            "label": "Memory",
            "description": "Specifies the memory resource required for the container, If set to 0, there is no limit.",
            "validate": {
                "required": true,
                "defaultValue": "1024Mi",
                "immutable": false
            },
            "jsonKey": "memory",
            "uiType": "MemoryNumber",
            "style": {
                "colSpan": 12
            }
        },
        {
            "sort": 7,
            "label": "CPU",
            "description": "Specifies the cpu resource required for the container, If set to 0, there is no limit.",
            "validate": {
                "required": true,
                "defaultValue": "0.5",
                "immutable": false
            },
            "jsonKey": "cpu",
            "uiType": "CPUNumber",
            "style": {
                "colSpan": 12
            }
        },
        {
            "sort": 9,
            "label": "CMD",
            "description": "Commands to run in the container",
            "validate": {
                "immutable": false
            },
            "jsonKey": "cmd",
            "uiType": "Strings"
        },
        {
            "sort": 10,
            "label": "ENV",
            "description": "Define arguments by using environment variables",
            "validate": {
                "immutable": false
            },
            "jsonKey": "env",
            "uiType": "Structs",
            "subParameterGroupOption": [
                {
                    "label": "Add By Value",
                    "keys": [
                        "name",
                        "value"
                    ]
                },
                {
                    "label": "Add By Secret",
                    "keys": [
                        "name",
                        "valueFrom"
                    ]
                }
            ],
            "subParameters": [
                {
                    "sort": 100,
                    "label": "Name",
                    "description": "Environment variable name",
                    "validate": {
                        "required": true,
                        "immutable": false
                    },
                    "jsonKey": "name",
                    "uiType": "Input"
                },
                {
                    "sort": 101,
                    "label": "Value",
                    "description": "The value of the environment variable",
                    "validate": {
                        "immutable": false
                    },
                    "jsonKey": "value",
                    "uiType": "Input"
                },
                {
                    "sort": 102,
                    "label": "Secret Selector",
                    "description": "Specifies a source the value of this var should come from",
                    "validate": {
                        "immutable": false
                    },
                    "jsonKey": "valueFrom",
                    "uiType": "Ignore",
                    "subParameters": [
                        {
                            "sort": 100,
                            "label": "ConfigMapKeyRef",
                            "description": "Selects a key of a config map in the pod's namespace",
                            "validate": {
                                "immutable": false
                            },
                            "jsonKey": "configMapKeyRef",
                            "uiType": "Group",
                            "disable": true,
                            "subParameters": [
                                {
                                    "sort": 100,
                                    "label": "Key",
                                    "description": "The key of the config map to select from. Must be a valid secret key",
                                    "validate": {
                                        "required": true,
                                        "immutable": false
                                    },
                                    "jsonKey": "key",
                                    "uiType": "Input"
                                },
                                {
                                    "sort": 101,
                                    "label": "Name",
                                    "description": "The name of the config map in the pod's namespace to select from",
                                    "validate": {
                                        "required": true,
                                        "immutable": false
                                    },
                                    "jsonKey": "name",
                                    "uiType": "Input"
                                }
                            ]
                        },
                        {
                            "sort": 101,
                            "label": "SecretKeyRef",
                            "description": "Selects a key of a secret in the pod's namespace",
                            "validate": {
                                "immutable": false
                            },
                            "jsonKey": "secretKeyRef",
                            "uiType": "Ignore",
                            "subParameters": [
                                {
                                    "sort": 1,
                                    "label": "Secret Name",
                                    "description": "The name of the secret in the pod's namespace to select from",
                                    "validate": {
                                        "required": true,
                                        "immutable": false
                                    },
                                    "jsonKey": "name",
                                    "uiType": "SecretSelect"
                                },
                                {
                                    "sort": 3,
                                    "label": "Secret Key",
                                    "description": "The key of the secret to select from. Must be a valid secret key",
                                    "validate": {
                                        "required": true,
                                        "immutable": false
                                    },
                                    "jsonKey": "key",
                                    "uiType": "SecretKeySelect"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "sort": 13,
            "label": "ReadinessProbe",
            "description": "Instructions for assessing whether the container is in a suitable state to serve traffic.",
            "validate": {
                "immutable": false
            },
            "jsonKey": "readinessProbe",
            "uiType": "Group",
            "subParameters": [
                {
                    "sort": 1,
                    "label": "TimeoutSeconds",
                    "description": "Number of seconds after which the probe times out.",
                    "validate": {
                        "required": true,
                        "defaultValue": 1,
                        "immutable": false
                    },
                    "jsonKey": "timeoutSeconds",
                    "uiType": "Number",
                    "style": {
                        "colSpan": 12
                    }
                },
                {
                    "sort": 4,
                    "label": "FailureThreshold",
                    "description": "Number of consecutive failures required to determine the container is not alive (liveness probe) or not ready (readiness probe).",
                    "validate": {
                        "required": true,
                        "defaultValue": 3,
                        "immutable": false
                    },
                    "jsonKey": "failureThreshold",
                    "uiType": "Number",
                    "style": {
                        "colSpan": 12
                    }
                },
                {
                    "sort": 7,
                    "label": "InitialDelaySeconds",
                    "description": "Number of seconds after the container is started before the first probe is initiated.",
                    "validate": {
                        "required": true,
                        "defaultValue": 5,
                        "immutable": false
                    },
                    "jsonKey": "initialDelaySeconds",
                    "uiType": "Number",
                    "style": {
                        "colSpan": 12
                    }
                },
                {
                    "sort": 9,
                    "label": "PeriodSeconds",
                    "description": "How often, in seconds, to execute the probe.",
                    "validate": {
                        "required": true,
                        "defaultValue": 10,
                        "immutable": false
                    },
                    "jsonKey": "periodSeconds",
                    "uiType": "Number",
                    "style": {
                        "colSpan": 12
                    }
                },
                {
                    "sort": 11,
                    "label": "SuccessThreshold",
                    "description": "Minimum consecutive successes for the probe to be considered successful after having failed.",
                    "validate": {
                        "required": true,
                        "defaultValue": 1,
                        "immutable": false
                    },
                    "jsonKey": "successThreshold",
                    "uiType": "Number",
                    "style": {
                        "colSpan": 12
                    }
                },
                {
                    "sort": 14,
                    "label": "Exec",
                    "description": "Instructions for assessing container health by executing a command. Either this attribute or the httpGet attribute or the tcpSocket attribute MUST be specified. This attribute is mutually exclusive with both the httpGet attribute and the tcpSocket attribute.",
                    "validate": {
                        "immutable": false
                    },
                    "jsonKey": "exec",
                    "uiType": "Group",
                    "subParameters": [
                        {
                            "sort": 100,
                            "label": "Command",
                            "description": "A command to be executed inside the container to assess its health. Each space delimited token of the command is a separate array element. Commands exiting 0 are considered to be successful probes, whilst all other exit codes are considered failures.",
                            "validate": {
                                "required": true,
                                "immutable": false
                            },
                            "jsonKey": "command",
                            "uiType": "Strings"
                        }
                    ]
                },
                {
                    "sort": 19,
                    "label": "TcpSocket",
                    "description": "Instructions for assessing container health by probing a TCP socket. Either this attribute or the exec attribute or the httpGet attribute MUST be specified. This attribute is mutually exclusive with both the exec attribute and the httpGet attribute.",
                    "validate": {
                        "immutable": false
                    },
                    "jsonKey": "tcpSocket",
                    "uiType": "Group",
                    "subParameters": [
                        {
                            "sort": 100,
                            "label": "Port",
                            "description": "The TCP socket within the container that should be probed to assess container health.",
                            "validate": {
                                "required": true,
                                "min": 1,
                                "immutable": false
                            },
                            "jsonKey": "port",
                            "uiType": "Number"
                        }
                    ]
                },
                {
                    "sort": 19,
                    "label": "HttpGet",
                    "description": "Instructions for assessing container health by executing an HTTP GET request. Either this attribute or the exec attribute or the tcpSocket attribute MUST be specified. This attribute is mutually exclusive with both the exec attribute and the tcpSocket attribute.",
                    "validate": {
                        "immutable": false
                    },
                    "jsonKey": "httpGet",
                    "uiType": "Group",
                    "subParameters": [
                        {
                            "sort": 1,
                            "label": "Port",
                            "description": "The TCP socket within the container to which the HTTP GET request should be directed.",
                            "validate": {
                                "required": true,
                                "min": 1,
                                "immutable": false
                            },
                            "jsonKey": "port",
                            "uiType": "Number",
                            "style": {
                                "colSpan": 12
                            }
                        },
                        {
                            "sort": 3,
                            "label": "Path",
                            "description": "The endpoint, relative to the port, to which the HTTP GET request should be directed.",
                            "validate": {
                                "required": true,
                                "pattern": "^/(.*)$",
                                "immutable": false
                            },
                            "jsonKey": "path",
                            "uiType": "Input",
                            "style": {
                                "colSpan": 12
                            }
                        },
                        {
                            "sort": 5,
                            "label": "HttpHeaders",
                            "description": "",
                            "validate": {
                                "immutable": false
                            },
                            "jsonKey": "httpHeaders",
                            "uiType": "Structs",
                            "subParameters": [
                                {
                                    "sort": 100,
                                    "label": "Name",
                                    "description": "",
                                    "validate": {
                                        "required": true,
                                        "immutable": false
                                    },
                                    "jsonKey": "name",
                                    "uiType": "Input"
                                },
                                {
                                    "sort": 101,
                                    "label": "Value",
                                    "description": "",
                                    "validate": {
                                        "required": true,
                                        "immutable": false
                                    },
                                    "jsonKey": "value",
                                    "uiType": "Input"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "sort": 15,
            "label": "LivenessProbe",
            "description": "Instructions for assessing whether the container is alive.",
            "validate": {
                "immutable": false
            },
            "jsonKey": "livenessProbe",
            "uiType": "Group",
            "subParameters": [
                {
                    "sort": 1,
                    "label": "TimeoutSeconds",
                    "description": "Number of seconds after which the probe times out.",
                    "validate": {
                        "required": true,
                        "defaultValue": 1,
                        "immutable": false
                    },
                    "jsonKey": "timeoutSeconds",
                    "uiType": "Number",
                    "style": {
                        "colSpan": 12
                    }
                },
                {
                    "sort": 4,
                    "label": "FailureThreshold",
                    "description": "Number of consecutive failures required to determine the container is not alive (liveness probe) or not ready (readiness probe).",
                    "validate": {
                        "required": true,
                        "defaultValue": 3,
                        "immutable": false
                    },
                    "jsonKey": "failureThreshold",
                    "uiType": "Number",
                    "style": {
                        "colSpan": 12
                    }
                },
                {
                    "sort": 7,
                    "label": "InitialDelaySeconds",
                    "description": "Number of seconds after the container is started before the first probe is initiated.",
                    "validate": {
                        "required": true,
                        "defaultValue": 5,
                        "immutable": false
                    },
                    "jsonKey": "initialDelaySeconds",
                    "uiType": "Number",
                    "style": {
                        "colSpan": 12
                    }
                },
                {
                    "sort": 9,
                    "label": "PeriodSeconds",
                    "description": "How often, in seconds, to execute the probe.",
                    "validate": {
                        "required": true,
                        "defaultValue": 10,
                        "immutable": false
                    },
                    "jsonKey": "periodSeconds",
                    "uiType": "Number",
                    "style": {
                        "colSpan": 12
                    }
                },
                {
                    "sort": 11,
                    "label": "SuccessThreshold",
                    "description": "Minimum consecutive successes for the probe to be considered successful after having failed.",
                    "validate": {
                        "required": true,
                        "defaultValue": 1,
                        "immutable": false
                    },
                    "jsonKey": "successThreshold",
                    "uiType": "Number",
                    "style": {
                        "colSpan": 12
                    }
                },
                {
                    "sort": 14,
                    "label": "Exec",
                    "description": "Instructions for assessing container health by executing a command. Either this attribute or the httpGet attribute or the tcpSocket attribute MUST be specified. This attribute is mutually exclusive with both the httpGet attribute and the tcpSocket attribute.",
                    "validate": {
                        "immutable": false
                    },
                    "jsonKey": "exec",
                    "uiType": "Group",
                    "subParameters": [
                        {
                            "sort": 100,
                            "label": "Command",
                            "description": "A command to be executed inside the container to assess its health. Each space delimited token of the command is a separate array element. Commands exiting 0 are considered to be successful probes, whilst all other exit codes are considered failures.",
                            "validate": {
                                "required": true,
                                "immutable": false
                            },
                            "jsonKey": "command",
                            "uiType": "Strings"
                        }
                    ]
                },
                {
                    "sort": 19,
                    "label": "TcpSocket",
                    "description": "Instructions for assessing container health by probing a TCP socket. Either this attribute or the exec attribute or the httpGet attribute MUST be specified. This attribute is mutually exclusive with both the exec attribute and the httpGet attribute.",
                    "validate": {
                        "immutable": false
                    },
                    "jsonKey": "tcpSocket",
                    "uiType": "Group",
                    "subParameters": [
                        {
                            "sort": 100,
                            "label": "Port",
                            "description": "The TCP socket within the container that should be probed to assess container health.",
                            "validate": {
                                "required": true,
                                "min": 1,
                                "immutable": false
                            },
                            "jsonKey": "port",
                            "uiType": "Number"
                        }
                    ]
                },
                {
                    "sort": 19,
                    "label": "HttpGet",
                    "description": "Instructions for assessing container health by executing an HTTP GET request. Either this attribute or the exec attribute or the tcpSocket attribute MUST be specified. This attribute is mutually exclusive with both the exec attribute and the tcpSocket attribute.",
                    "validate": {
                        "immutable": false
                    },
                    "jsonKey": "httpGet",
                    "uiType": "Group",
                    "subParameters": [
                        {
                            "sort": 1,
                            "label": "Port",
                            "description": "The TCP socket within the container to which the HTTP GET request should be directed.",
                            "validate": {
                                "required": true,
                                "min": 1,
                                "immutable": false
                            },
                            "jsonKey": "port",
                            "uiType": "Number",
                            "style": {
                                "colSpan": 12
                            }
                        },
                        {
                            "sort": 3,
                            "label": "Path",
                            "description": "The endpoint, relative to the port, to which the HTTP GET request should be directed.",
                            "validate": {
                                "required": true,
                                "pattern": "^/(.*)$",
                                "immutable": false
                            },
                            "jsonKey": "path",
                            "uiType": "Input",
                            "style": {
                                "colSpan": 12
                            }
                        },
                        {
                            "sort": 5,
                            "label": "HttpHeaders",
                            "description": "",
                            "validate": {
                                "immutable": false
                            },
                            "jsonKey": "httpHeaders",
                            "uiType": "Structs",
                            "subParameters": [
                                {
                                    "sort": 100,
                                    "label": "Name",
                                    "description": "",
                                    "validate": {
                                        "required": true,
                                        "immutable": false
                                    },
                                    "jsonKey": "name",
                                    "uiType": "Input"
                                },
                                {
                                    "sort": 101,
                                    "label": "Value",
                                    "description": "",
                                    "validate": {
                                        "required": true,
                                        "immutable": false
                                    },
                                    "jsonKey": "value",
                                    "uiType": "Input"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "sort": 19,
            "label": "Annotations",
            "description": "Specify the annotations in the workload",
            "validate": {
                "immutable": false
            },
            "jsonKey": "annotations",
            "uiType": "KV",
            "additionalParameter": {
                "sort": 100,
                "label": "",
                "description": "",
                "validate": {
                    "immutable": false
                },
                "jsonKey": "",
                "uiType": "Input"
            },
            "additional": true
        },
        {
            "sort": 21,
            "label": "Labels",
            "description": "Specify the labels in the workload",
            "validate": {
                "immutable": false
            },
            "jsonKey": "labels",
            "uiType": "KV",
            "additionalParameter": {
                "sort": 100,
                "label": "",
                "description": "",
                "validate": {
                    "immutable": false
                },
                "jsonKey": "",
                "uiType": "Input"
            },
            "additional": true
        },
        {
            "sort": 24,
            "label": "Image Pull Policy",
            "description": "Specify image pull policy for your service",
            "validate": {
                "options": [
                    {
                        "label": "IfNotPresent",
                        "value": "IfNotPresent"
                    },
                    {
                        "label": "Always",
                        "value": "Always"
                    },
                    {
                        "label": "Never",
                        "value": "Never"
                    }
                ],
                "defaultValue": "IfNotPresent",
                "immutable": false
            },
            "jsonKey": "imagePullPolicy",
            "uiType": "Select"
        },
        {
            "sort": 107,
            "label": "ImagePullSecrets",
            "description": "Specify image pull secrets for your service",
            "validate": {
                "immutable": false
            },
            "jsonKey": "imagePullSecrets",
            "uiType": "Strings"
        },
        {
            "sort": 111,
            "label": "Volumes",
            "description": "Declare volumes and volumeMounts",
            "validate": {
                "immutable": false
            },
            "jsonKey": "volumes",
            "uiType": "Structs",
            "disable": true,
            "subParameters": [
                {
                    "sort": 100,
                    "label": "Medium",
                    "description": "",
                    "validate": {
                        "required": true,
                        "options": [
                            {
                                "label": "",
                                "value": ""
                            },
                            {
                                "label": "Memory",
                                "value": "Memory"
                            },
                            {
                                "label": "Memory",
                                "value": "Memory"
                            }
                        ],
                        "defaultValue": "",
                        "immutable": false
                    },
                    "jsonKey": "medium",
                    "uiType": "Select"
                },
                {
                    "sort": 101,
                    "label": "MountPath",
                    "description": "",
                    "validate": {
                        "required": true,
                        "immutable": false
                    },
                    "jsonKey": "mountPath",
                    "uiType": "Input"
                },
                {
                    "sort": 102,
                    "label": "Name",
                    "description": "",
                    "validate": {
                        "required": true,
                        "immutable": false
                    },
                    "jsonKey": "name",
                    "uiType": "Input"
                },
                {
                    "sort": 103,
                    "label": "Type",
                    "description": "Specify volume type, options: \"pvc\",\"configMap\",\"secret\",\"emptyDir\", default to emptyDir",
                    "validate": {
                        "required": true,
                        "options": [
                            {
                                "label": "EmptyDir",
                                "value": "emptyDir"
                            },
                            {
                                "label": "Pvc",
                                "value": "pvc"
                            },
                            {
                                "label": "ConfigMap",
                                "value": "configMap"
                            },
                            {
                                "label": "Secret",
                                "value": "secret"
                            }
                        ],
                        "defaultValue": "emptyDir",
                        "immutable": false
                    },
                    "jsonKey": "type",
                    "uiType": "Select"
                }
            ]
        }
    ]
}
const b=
{
    "name":"add", //应用名称
    "alias":"", //应用别名
    "description":'', //描述：应用描述信息
    "project":"system", //应用所属的项目名称
    "component": { //应用组件信息
        "componentType":"jobs.batch", //组件类型
        "name":"task" //名称
    },
    "envBinding":{ //应用环境绑定信息
        "name":"system",
    },
    "icon":"", //应用图标信息
    
    
}
const c={
    "alias": "string",
    "component": {
        "alias": "string",
        "componentType": "string",
        "dependsOn": [
            {}
        ],
        "description": "string",
        "icon": "string",
        "inputs": [
            {
                "from": "string",
                "parameterKey": "string"
            }
        ],
        "labels": {},
        "name": "string",
        "outputs": [
            {
                "name": "string",
                "valueFrom": "string"
            }
        ],
        "properties": "string",
        "traits": [
            {
                "alias": "string",
                "description": "string",
                "properties": "string",
                "type": "string"
            }
        ]
    },
    "description": "string",
    "envBinding": [
        {
            "name": "string"
        }
    ],
    "icon": "string",
    "labels": {},
    "name": "string",
    "project": "string"
}