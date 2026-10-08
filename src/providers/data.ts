import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
import type { BaseRecord, GetListParams, GetListResponse } from "@refinedev/core";
import { API_URL, MOCK_SUBJECTS } from "./constants";

const { dataProvider: restDataProvider, kyInstance } = createSimpleRestDataProvider({
  apiURL: API_URL,
});

const getList = async <TData extends BaseRecord = BaseRecord>(
  params: GetListParams,
): Promise<GetListResponse<TData>> => {
  if (params.resource !== "subjects") {
    return restDataProvider.getList<TData>(params);
  }

  return {
    data: MOCK_SUBJECTS as unknown as TData[],
    total: MOCK_SUBJECTS.length,
  };
};

export const dataProvider = { ...restDataProvider, getList };
export { kyInstance };
