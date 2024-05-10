import { ResponseType } from "../vite-env";

export const origin = "http://10.76.0.167:8002";
const back = "http://10.192.10.157:8080";
const prefix = back + "/api";
export async function getFetcher<T>(key: string) {
  const resp = (await fetch(prefix + key, {
    headers: {
      "Content-type": "application/json",
    },
    mode: "cors",
  }).then((res) => res.json())) as ResponseType<T>;

  if (!resp.success) {
    throw new Error(resp.errcode + ": " + resp.errmsg);
  }
  return resp.data;
}

export async function postFetcher<T>(
  key: string,
  //注：Record类型用于创建一个具有指定属性类型的新对象类型
  body: { arg: Record<string, unknown> | Array<unknown> | null }
) {
  const resp = (await fetch(prefix + key, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    //修改了null请求体不被接收的问题
    body: JSON.stringify(body.arg) == "null" ? "{}" : JSON.stringify(body.arg),
    mode: "cors",
  }).then((res) => res.json())) as ResponseType<T>;
  return resp;
}
