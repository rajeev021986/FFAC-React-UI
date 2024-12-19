import ENDPOINTS from "./Endpoints";
import ApiMethods from "./ApiMethods";

class ApiManager {
    static login = async (payload) => {
        const url = ENDPOINTS.LOGIN();
        return ApiMethods.post(url, payload);
    }

    static addUser = async (payload) => {
        const url = ENDPOINTS.ADD_USER();
        return ApiMethods.post(url, payload);
    }

    static getUsers = async (limit, page) => {
        const url = ENDPOINTS.GET_USERS(limit, page);
        return ApiMethods.get(url);
    }

    static getVesselOptions = async (search) => {
        const url = ENDPOINTS.GET_VESSEL_OPTIONS(search);
        return ApiMethods.get(url);
    }

    static getMenu = async () => {
        const url = ENDPOINTS.GET_MENU();

        return ApiMethods.get(url);
    }

    static getPolPodOptions = async (search) => {
        const url = ENDPOINTS.POL_POD_OPTION(search);
        return ApiMethods.get(url);
    }
    static getfinalDestOptions = async (search) => {
        const url = ENDPOINTS.FINAL_DESTI_OPTION(search);
        return ApiMethods.get(url);
    }

    static CheckUser = async (payload) => {
        const url = ENDPOINTS.CHECK_USER();
        return ApiMethods.post(url, payload);
    }

    static rejectUser = async (payload) => {
        const url = ENDPOINTS.REJECT_USER();
        return ApiMethods.post(url, payload);
    }
    static getCompanyOptions = async (role, search) => {
        const url = ENDPOINTS.Company_OPTION(role, search);
        return ApiMethods.get(url);
    }

    static getPLPOByBol = async (bol) => {
        const url = ENDPOINTS.OTM_BOL(bol);
        return ApiMethods.get(url);
    }
    static getSalesOptions = async (name, search) => {
        const url = ENDPOINTS.GET_SALES_OPTIONS(name, search);
        return ApiMethods.get(url);
    }
    static getCityOptions = async (name, search) => {
        const url = ENDPOINTS.GET_CITY_OPTIONS(name, search);
        return ApiMethods.get(url);
    }
    static getCommonOptions = async (name, search) => {
        const url = ENDPOINTS.GET_COMMON_OPTIONS(name, search);
        return ApiMethods.get(url);
    }
    static getAuditDetails = async (id) => {
        const url = ENDPOINTS.GET_CUSTOMER_AUDIT(id);
        return ApiMethods.get(url);
    }
    static getCustomerFormData = async (source, id) => {
        const url = ENDPOINTS.GET_CUSTOMER_DOCUMENT_FILE(source, id);
        return ApiMethods.get(url);
    }
    static getCustomerDeatils = async (id) => {
        const url = ENDPOINTS.GET_CUSTOMER_DETAILS(id);
        return ApiMethods.get(url);
    }
    static downloadDocumnent = async (id, source, sourceId) => {
        const url = ENDPOINTS.DOWNLOAD_DOCUMENT(id, source, sourceId);
        return ApiMethods.get(url);
    }
    static deleteDocument = async (id, source, sourceId) => {
        const url = ENDPOINTS.DOCUMENT_DELETE(id, source, sourceId);
        return ApiMethods.delete(url);
    }
    static approveCustomerApprove = async (id, type) => {
        const url = ENDPOINTS.CUSTOMER_APPROVE_REQUEST(id, type);
        return ApiMethods.put(url);
    }
    static rejectCustomerApprove = async (id, type) => {
        const url = ENDPOINTS.CUSTOMER_REJECT_REQUEST(id, type);
        return ApiMethods.put(url);
    }
    static fetchCustomerDatasExcel = async (params, payload,source) => {
        const queryString = new URLSearchParams(params).toString();
        const url = ENDPOINTS.FETCH_CUSTOMER_DATA_EXCEL(queryString,source);
        return ApiMethods.postBlob(url, payload);
    }
    static getUserData = async (id) => {
        const url = ENDPOINTS.GET_USER_DATA(id);
        return ApiMethods.get(url);
    }
    static deleteUser = async (id) => {
        const url = ENDPOINTS.DELETE_USER(id);
        return ApiMethods.delete(url);
    }
    static addUserData = async (payload) => {
        const url = ENDPOINTS.ADD_USER_DATA();
        return ApiMethods.post(url, payload);
    }
    static updateUserData = async (payload) => {
        const url = ENDPOINTS.UPDATE_USER_DATA();
        return ApiMethods.put(url, payload);
    }
    static deleteRole = async (id) => {
        const url = ENDPOINTS.DELETE_ROLE(id);
        return ApiMethods.delete(url);
    }
    static addRole = async (payload) => {
        const url = ENDPOINTS.ADD_ROLE();
        return ApiMethods.post(url, payload);
    }
    static removeAssignedUser = (params) => {
        const url = ENDPOINTS.REMOVE_ASSIGNED_USER(params);
        return ApiMethods.delete(url);
    }
    static getRolepermissions = (id) => {
        const url = ENDPOINTS.GET_ROLE_PERMISSIONS(id);
        return ApiMethods.get(url);
    }
    static getRoles = () => {
        const url = ENDPOINTS.GET_ROLES();
        return ApiMethods.get(url);
    }
    static updateRolePermissions = async (payload) => {
        const url = ENDPOINTS.UPDATE_ROLE_PERMISSIONS();
        return ApiMethods.put(url, payload);
    }
    static userPassReset = async (payload) => {
        const url = ENDPOINTS.USER_PASS_RESET();
        return ApiMethods.put(url, payload);
    }

    static fetchEditVessel = (id) => {
        const url = ENDPOINTS.GET_EDIT_VESSEL(id);
        return ApiMethods.get(url);
    }

    static fetchVesselDatasExcel = async (params, payload) => {
        const queryString = new URLSearchParams(params).toString();
        const url = ENDPOINTS.FETCH_VESSEL_DATA_EXCEL(queryString);
        return ApiMethods.postBlob(url, payload);
    }

    static fetchVesselSuggestions = (inputValue, id) => {
        const url = ENDPOINTS.FETCH_VESSEL_SUGGESTIONS(inputValue, id);
        return ApiMethods.get(url);
    }


    static updateUserProfile = async (payload) => {
        const url = ENDPOINTS.UPDATE_USER_PROFILE();
        return ApiMethods.put(url, payload);
    }
    static updateUserProfileImage = async (payload, id) => {
        const url = ENDPOINTS.UPDATE_USER_PROFILE_IMAGE(id);
        return ApiMethods.put(url, payload);
    }
}


export default ApiManager;