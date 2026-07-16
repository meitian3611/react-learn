import request from "@/utils/request";

/** 获取评论列表 */
export const getComments = (params?: Record<string, any>) => {
  return request.get("/getList", { params });
};
