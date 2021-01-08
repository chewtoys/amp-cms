import { HTTPMethod, JSONObject } from "core/types";

export class Api {
  constructor(public host: string = "") {}

  fetch = typeof window !== "undefined" && window.fetch.bind(window);

  call = (
    path: string,
    method: HTTPMethod = "GET",
    input?: JSONObject | FormData
  ) =>
    this.fetch(this.host + path, {
      method,
      mode: "cors",
      body: input && JSON.stringify(input),
      headers: input
        ? {
            "Content-Type": "application/json",
          }
        : {},
      credentials: "include",
    })
      .then(async (res) => {
        let response;
        try {
          response = await res.json();
        } catch (error) {
          response = {
            code: res.status,
            errors: [
              {
                name: error.name,
                message: error.message,
              },
            ],
          };
        }
        return response;
      })
      .catch((error) => {
        return {
          code: undefined,
          errors: [
            {
              name: error.name,
              message: error.message,
            },
          ],
        };
      });

  get = (path: string) => this.call(path);
  post = (path: string, input: JSONObject) => this.call(path, "POST", input);
  patch = (path: string, input: JSONObject) => this.call(path, "PATCH", input);
  delete = (path: string) => this.call(path);
}
export default new Api();
