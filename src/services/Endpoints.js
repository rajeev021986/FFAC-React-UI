const ENDPOINTS = {
  LOGIN: () => `/auth-service/auth/login`,
  ADD_USER: () => `/users`,
  GET_USERS: (limit, page) => `/users?limit=${limit}&page=${page}`,
  GET_VESSEL_OPTIONS: (search) => `/vessel?vessel=${search}`,
  GET_MENU: () => `/admin-service/v1/menu/submenu/permissions?userId=admin`,
  POL_POD_OPTION: (search) => `/getPolPOD?search=${search}`,
  FINAL_DESTI_OPTION: (search) => `/getFinalDestination?search=${search}`,
  Company_OPTION: (role, search) => `/company?role=${role}&search=${search}`,
  CHECK_USER: () => `/auth/check_user`,
  REJECT_USER: () => "/users/reject_request",
  OTM_BOL: (bol) => `/otm_bol?bol=${bol}`,
  GET_SALES_OPTIONS: (name, search) =>
    `/getAutoComplete?name=${name}&search=${search}`,
  GET_CITY_OPTIONS: (name, search) =>
    `/getAutoComplete?name=${name}&search=${search}`,
  GET_COMMON_OPTIONS: (name, search) =>
    `/getAutoComplete?name=${name}&search=${search}`,
  GET_DOCUMENT_FILES: (source, id) =>
    `/entity-service/v1/file?source=${source}&sourceId=${id}`,
  GET_SHIPPER_DOCUMENT_FILE: (source, id) =>
    `/entity-service/file/get?source=${source}&sourceId=${id}`,
  DOWNLOAD_DOCUMENT: (id, source, sourceId) =>
    `/entity-service/v1/file/${id}?source=${source}&sourceId=${sourceId}`,
  DOCUMENT_DELETE: (id, source, sourceId) =>
    `/entity-service/v1/file/${id}?source=${source}&sourceId=${sourceId}`,
  GET_CUSTOMER_DETAILS: (id) => `/entity-service/v1/customer/${id}`,
  GET_SHIPPER_DETAILS: (id) => `/entity-service/v1/shipper/${id}`,
  GET_CONSIGNEE_DETAILS: (id) => `/entity-service/v1/consignee/${id}`,
  GET_ICD_DETAILS: (id) => `/master-service/v1/icd/${id}`,
  CUSTOMER_APPROVE_REQUEST: (id, type) =>
    `/entity-service/v1/approval/approved/${type}/${id}`,
  CUSTOMER_REJECT_REQUEST: (id, type) =>
    `/entity-service/v1/approval/rejected/${type}/${id}`,
  GET_USER_DATA: (id) => `/admin-service/v1/user/${id}`,
  ADD_USER_DATA: () => `/admin-service/v1/user`,
  UPDATE_USER_DATA: () => `/admin-service/v1/user`,
  DELETE_ROLE: (id) => `/admin-service/v1/role/${id}`,
  REMOVE_ASSIGNED_USER: (params) => `/admin-service/v1/${params}`,
  ADD_ROLE: () => `/admin-service/v1/role`,
  GET_ROLE_PERMISSIONS: (id) =>
    `/admin-service/v1/menu/submenu/permissions/role/${id}`,
  DELETE_USER: (id) => `/admin-service/v1/user/${id}`,
  GET_ROLES: () => `/admin-service/v1/role`,
  UPDATE_ROLE_PERMISSIONS: () => `/admin-service/v1/role/permissions/update`,
  UPDATE_USER_PROFILE: () => `/admin-service/v1/profile`,
  UPDATE_USER_PROFILE_IMAGE: (id) => `/admin-service/v1/profile/image?id=${id}`,
  USER_PASS_RESET: () => `/admin-service/v1/user/password`,
  GET_EDIT_VESSEL: (id) => `/master-service/v1/vessel/${id}`,
  FETCH_VESSEL_SUGGESTIONS: (inputValue, id) =>
    `/admin-service/v1/data?pattern=${inputValue}&type=${id}`,
  GET_EDIT_VOYAGE: (id) => `/master-service/v1/vessel/voyage/${id}`,
  FETCH_AUTOCOMPLETE_DATA: (inputValue, id) =>
    `/admin-service/v1/data?pattern=${inputValue}&type=${id}`,
  FILE_DOWNLOAD_INTEGATER: (id) => `/entity-service/v1/file/audit/${id}`,
  GET_AUDIT_DATA: (id, page, service) => `/${service}/v1/${page}/audit/${id}`,
  FETCH_DATA_EXCEL: (queryString, service, page) =>
    `/${service}/v1/${page}/export?${queryString}`,
};

export default ENDPOINTS;
