// Environment
import { environment } from "../../../environments/environment";

export const API_END_POINTS = {
  // COMPANY: {
  //   LIST: "company/view",
  //   CREATE: "company/create",
  //   DELETE: "company/delete",
  //   UPDATE: "company/update",
  //   FETCH: "company/fetch",
  //   BLOCK_UBLOCK: "company/blockUnblock",
  // },
  USER: {
    LIST: "Api/CenterData/AllFiles",
  },
LOGIN:{
  UPDATE:"api/UpdateLogin"
}
};

export function getApiEndPoint(path: string, data?: any) {
  let apiPath: any = environment.apiUrl + path;
  return data ? apiPath + "/" + data : apiPath;
}
