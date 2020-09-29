import Cookies from "js-cookie";
import { ApiApi, Configuration } from "@/assets/.codegen";

const headers = {
  "X-CSRFToken": Cookies.get("csrftoken") || "",
};
const basePath = "";

const config = new Configuration({ basePath, headers });
const api = new ApiApi(config);

export default api;
