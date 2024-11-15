

const ENDPOINTS = {
    LOGIN: () => `/auth-service/auth/login`,
    ADD_USER: () => `/users`,
    GET_USERS: (limit,page) => `/users?limit=${limit}&page=${page}`,
    GET_VESSEL_OPTIONS: (search) => `/vessel?vessel=${search}`, 
    GET_MENU: () => `/admin-service/menu/submenu/permissions?userId=admin`,
    POL_POD_OPTION: (search) => `/getPolPOD?search=${search}`,
    FINAL_DESTI_OPTION: (search) => `/getFinalDestination?search=${search}`,
    Company_OPTION: (role, search) => `/company?role=${role}&search=${search}`,
    CHECK_USER : ()=> `/auth/check_user`,
    REJECT_USER : ()=> '/users/reject_request',
    OTM_BOL : (bol)=> `/otm_bol?bol=${bol}`,
    GET_SALES_OPTIONS: (name, search) => `/getAutoComplete?name=${name}&search=${search}`,
    GET_CITY_OPTIONS: (name, search) => `/getAutoComplete?name=${name}&search=${search}`,
    GET_COMMON_OPTIONS: (name, search) => `/getAutoComplete?name=${name}&search=${search}`,
}

export default ENDPOINTS;