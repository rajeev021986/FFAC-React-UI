

const ENDPOINTS = {
    LOGIN: () => `/auth-service/auth/login`,
    ADD_USER: () => `/users`,
    GET_USERS: (limit, page) => `/users?limit=${limit}&page=${page}`,
    GET_VESSEL_OPTIONS: (search) => `/vessel?vessel=${search}`,
    GET_MENU: () => `/admin-service/menu/submenu/permissions?userId=admin`,
    POL_POD_OPTION: (search) => `/getPolPOD?search=${search}`,
    FINAL_DESTI_OPTION: (search) => `/getFinalDestination?search=${search}`,
    Company_OPTION: (role, search) => `/company?role=${role}&search=${search}`,
    CHECK_USER: () => `/auth/check_user`,
    REJECT_USER: () => '/users/reject_request',
    OTM_BOL: (bol) => `/otm_bol?bol=${bol}`,
    GET_SALES_OPTIONS: (name, search) => `/getAutoComplete?name=${name}&search=${search}`,
    GET_CITY_OPTIONS: (name, search) => `/getAutoComplete?name=${name}&search=${search}`,
    GET_COMMON_OPTIONS: (name, search) => `/getAutoComplete?name=${name}&search=${search}`,
    GET_CUSTOMER_AUDIT: (id) => `/entity-service/customer/audit/${id}`,
    GET_CUSTOMER_DOCUMENT_FILE: (source, id) => `/entity-service/file/get?source=${source}&sourceId=${id}`,
    DOWNLOAD_DOCUMENT: (id, source, sourceId) => `/entity-service/file/download/${id}?source=${source}&sourceId=${sourceId}`,
    DOCUMENT_DELETE: (id, source, sourceId) => `/entity-service/file/delete/${id}?source=${source}&sourceId=${sourceId}`,
    GET_CUSTOMER_DETAILS: (id) => `/entity-service/customer/get/${id}`,
    CUSTOMER_APPROVE_REQUEST: (id, type) => `/entity-service/approval/set/approved/${type}/${id}`,
    CUSTOMER_REJECT_REQUEST: (id, type) => `/entity-service/approval/set/rejected/${type}/${id}`,
    FETCH_CUSTOMER_DATA_EXCEL: (queryString) => `/entity-service/customer/export?${queryString}`,
    GET_USER_DATA: (id) => `/admin-service/user/${id}`,
    ADD_USER_DATA: () => `/admin-service/user/save`,
    UPDATE_USER_DATA: () => `/admin-service/user/update`,
    DELETE_ROLE: (id) => `/admin-service/role/${id}`,
    REMOVE_ASSIGNED_USER: (params) => `/admin-service/${params}`,
    ADD_ROLE: () => `/admin-service/role`,
    GET_ROLE_PERMISSIONS: (id) => `/admin-service/menu/submenu/permissions/role/${id}`,
    DELETE_USER: (id) => `/admin-service/user/${id}`,
    GET_ROLES: () => `/admin-service/role`,
    UPDATE_ROLE_PERMISSIONS: () => `/admin-service/role/permissions/update`,
    USER_PASS_RESET: () => `/admin-service/user/update/password`
}

export default ENDPOINTS;