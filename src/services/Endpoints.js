const ENDPOINTS = {
  LOGIN: () => `/auth-service/auth/login`,
  ADD_USER: () => `/users`,
  GET_USERS: (limit, page) => `/users?limit=${limit}&page=${page}`,
  GET_VESSEL_OPTIONS: (search) => `/vessel?vessel=${search}`,
  GET_MENU: (BasePageUrl) =>
    `/${BasePageUrl}/menu/submenu/permissions?userId=admin`,
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
  GET_DOCUMENT_FILES: (source, id, BasePageUrl) =>
    `/${BasePageUrl}/file?source=${source}&sourceId=${id}`,

  GET_DOCUMENT_EDIT_JOB_FILES: (source, type, id, BasePageUrl) =>
    `/${BasePageUrl}/file/type?source=${source}&docType=${type}&sourceId=${id}`,

  GET_SHIPPER_DOCUMENT_FILE: (source, id) =>
    `/entity-service/file/get?source=${source}&sourceId=${id}`,
  DOWNLOAD_DOCUMENT: (id, source, sourceId, BasePageUrl) =>
    `/${BasePageUrl}/file/${id}?source=${source}&sourceId=${sourceId}`,
  DOCUMENT_DELETE: (id, source, sourceId, BasePageUrl) =>
    `/${BasePageUrl}/file/${id}?source=${source}&sourceId=${sourceId}`,
  GET_CUSTOMER_DETAILS: (id, BasePageUrl) => `/${BasePageUrl}/customer/${id}`,
  GET_SHIPPER_DETAILS: (id, BasePageUrl) => `/${BasePageUrl}/shipper/${id}`,
  GET_CONSIGNEE_DETAILS: (id, BasePageUrl) => `/${BasePageUrl}/consignee/${id}`,
  GET_ICD_DETAILS: (id, BasePageUrl) => `/${BasePageUrl}/icd/${id}`,
  CUSTOMER_APPROVE_REQUEST: (id, type, BasePageUrl) =>
    `/${BasePageUrl}/approval/approved/${type}/${id}`,
  CUSTOMER_REJECT_REQUEST: (id, type, BasePageUrl) =>
    `/${BasePageUrl}/approval/rejected/${type}/${id}`,
  GET_USER_DATA: (id, BasePageUrl) => `/${BasePageUrl}/user/${id}`,
  ADD_USER_DATA: (BasePageUrl) => `/${BasePageUrl}/user`,
  UPDATE_USER_DATA: (BasePageUrl) => `/${BasePageUrl}/user`,
  DELETE_ROLE: (id, BasePageUrl) => `/${BasePageUrl}/role/${id}`,
  REMOVE_ASSIGNED_USER: (params, BasePageUrl) => `/${BasePageUrl}/${params}`,
  ADD_ROLE: (BasePageUrl) => `/${BasePageUrl}/role`,
  GET_ROLE_PERMISSIONS: (id, BasePageUrl) =>
    `/${BasePageUrl}/menu/submenu/permissions/role/${id}`,
  DELETE_USER: (id, BasePageUrl) => `/${BasePageUrl}/user/${id}`,
  GET_ROLES: (BasePageUrl) => `/${BasePageUrl}/role`,
  UPDATE_ROLE_PERMISSIONS: (BasePageUrl) =>
    `/${BasePageUrl}/role/permissions/update`,
  UPDATE_USER_PROFILE: (BasePageUrl) => `/${BasePageUrl}/profile`,
  UPDATE_USER_PROFILE_IMAGE: (id, BasePageUrl) =>
    `/${BasePageUrl}/profile/image?id=${id}`,
  USER_PASS_RESET: (BasePageUrl) => `/${BasePageUrl}/user/password`,
  GET_EDIT_VESSEL: (id, BasePageUrl) => `/${BasePageUrl}/vessel/${id}`,
  FETCH_VESSEL_SUGGESTIONS: (inputValue, id, BasePageUrl) =>
    `/${BasePageUrl}/data?pattern=${inputValue}&type=${id}`,
  GET_EDIT_VOYAGE: (id, BasePageUrl) => `/${BasePageUrl}/vessel/voyage/${id}`,
  FETCH_AUTOCOMPLETE_DATA: (inputValue, id, BasePageUrl, other) =>
    `/${BasePageUrl}/data?pattern=${inputValue}&type=${id}${
      other ? `&other=${other}` : ""
    }`,
  FILE_DOWNLOAD_INTEGATER: (id, BasePageUrl) =>
    `/${BasePageUrl}/file/audit/${id}`,
  GET_AUDIT_DATA: (id, page, service) => `/${service}/${page}/audit/${id}`,
  FETCH_DATA_EXCEL: (queryString, service, page) =>
    `/${service}/${page}/export?${queryString}`,

  GET_JOBENTRIES: (limit, page) =>
    `/job-detail/filter?limit=${limit}&page=${page}`,
  GET_JOBENTRY_DETAILS: (id, BasePageUrl) => `/${BasePageUrl}/job-detail/${id}`,
  GET_ADDRATE_DETAILS: (id, BasePageUrl) =>
    `/${BasePageUrl}/job-detail/rate/${id}`,
  UPDATE_ADDRATE_DETAILS: (BasePageUrl) => `/${BasePageUrl}/job-detail/rate`,
  JOB_APPROVE_REQUEST: (id, type, BasePageUrl) =>
    `/${BasePageUrl}/approval/approved/${type}/${id}`,
  ALL_JOBS_APPROVE_REQUEST: (type, BasePageUrl) =>
    `/${BasePageUrl}/approval/approved/${type}`,
  JOB_ENTRY_REJECT_REQUEST: (id, type, BasePageUrl) =>
    `/${BasePageUrl}/approval/rejected/${type}/${id}`,
  JOB_ENTRY_CANCEL_REQUEST: (id, type, BasePageUrl) =>
    `/${BasePageUrl}/approval/cancel/${type}/${id}`,
  GET_UPDATE_JOBENTRY_DETAILS: (id, BasePageUrl) =>
    `/${BasePageUrl}/job-update/${id}`,
  GET_UPDATE_CONTAINER_NUMBER: (id, BasePageUrl) =>
    `/${BasePageUrl}/job-update/container/${id}`,
  GET_VEHICLE_BY_ID: (id, BasePageUrl) =>
    `/${BasePageUrl}/job-update/vehicle/${id}`,
  GET_LOOSECARGO_BY_ID: (id, BasePageUrl) =>
    `/${BasePageUrl}/job-update/loose-cargo/${id}`,
  GET_PAYABLE_DETAILS: (id, BasePageUrl) =>
    `/${BasePageUrl}/payble/entry/${id}`,
  PAYABLE_APPROVE_REQUEST: (id, type, BasePageUrl) =>
    `/${BasePageUrl}/approval/approved/${type}/${id}`,
  PAYABLE_REJECT_REQUEST: (id, type, BasePageUrl) =>
    `/${BasePageUrl}/approval/rejected/${type}/${id}`,
  PAY_SELECTEDIDS_REQUEST: (BasePageUrl) =>
    `/${BasePageUrl}/pending/payble/pay`,
  PAYABLE_PAY_REQUEST: (id, BasePageUrl) =>
    `/${BasePageUrl}/pending/payble/pay/${id}`,
  PENDING_PAYABLE_CANCEL_REQUEST: (id, type, BasePageUrl) =>
    `/${BasePageUrl}/approval/cancel/${type}/${id}`,
  GET_PAY_DETAILS: (id, BasePageUrl) => `/${BasePageUrl}/pending/payble/${id}`,
  PENDING_PAYABLE_REJECT_REQUEST: (id, type, BasePageUrl) =>
    `/${BasePageUrl}/approval/rejected/${type}/${id}`,
  GET_RECEIVABLENTRY_DETAILS: (id, BasePageUrl) =>
    `/${BasePageUrl}/receivable/${id}`,
};

export default ENDPOINTS;
