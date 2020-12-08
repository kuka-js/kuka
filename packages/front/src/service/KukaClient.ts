export interface KukaRequest {
  method: Method
  path: string
  token: string
  payload?: string
}

export enum Method {
  POST,
  GET,
  PUT,
  PATCH,
  DELETE,
}
export class KukaClient {
  static async request(data: KukaRequest) {
    const response = await fetch("http://localhost:4000/local/" + data.path, {
      method: Method[data.method],
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.token,
      },
      body: data.payload,
    })
    const json = await response.json()
    return json
  }
}
