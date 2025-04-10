import ENDPOINTS from "./Endpoints";
import ApiMethods from "./ApiMethods";
import { menuConfigUrl } from "../store/menuConfigUrl";

class ApiManager {
  static login = async (payload) => {
    const url = ENDPOINTS.LOGIN();
    return ApiMethods.post(url, payload);
  };

  static addUser = async (payload) => {
    const url = ENDPOINTS.ADD_USER();
    return ApiMethods.post(url, payload);
  };

  static getUsers = async (limit, page) => {
    const url = ENDPOINTS.GET_USERS(limit, page);
    return ApiMethods.get(url);
  };

  static getVesselOptions = async (search) => {
    const url = ENDPOINTS.GET_VESSEL_OPTIONS(search);
    return ApiMethods.get(url);
  };

  static getMenu = async () => {
    const url = ENDPOINTS.GET_MENU(menuConfigUrl.admin);
    return ApiMethods.get(url);
  };

  static getPolPodOptions = async (search) => {
    const url = ENDPOINTS.POL_POD_OPTION(search);
    return ApiMethods.get(url);
  };

  static getfinalDestOptions = async (search) => {
    const url = ENDPOINTS.FINAL_DESTI_OPTION(search);
    return ApiMethods.get(url);
  };

  static CheckUser = async (payload) => {
    const url = ENDPOINTS.CHECK_USER();
    return ApiMethods.post(url, payload);
  };

  static rejectUser = async (payload) => {
    const url = ENDPOINTS.REJECT_USER();
    return ApiMethods.post(url, payload);
  };

  static getCompanyOptions = async (role, search) => {
    const url = ENDPOINTS.Company_OPTION(role, search);
    return ApiMethods.get(url);
  };

  static getPLPOByBol = async (bol) => {
    const url = ENDPOINTS.OTM_BOL(bol);
    return ApiMethods.get(url);
  };

  static getSalesOptions = async (name, search) => {
    const url = ENDPOINTS.GET_SALES_OPTIONS(name, search);
    return ApiMethods.get(url);
  };

  static getCityOptions = async (name, search) => {
    const url = ENDPOINTS.GET_CITY_OPTIONS(name, search);
    return ApiMethods.get(url);
  };

  static getCommonOptions = async (name, search) => {
    const url = ENDPOINTS.GET_COMMON_OPTIONS(name, search);
    return ApiMethods.get(url);
  };

  static getCustomerDeatils = async (id) => {
    const url = ENDPOINTS.GET_CUSTOMER_DETAILS(id, menuConfigUrl.entity);
    return ApiMethods.get(url);
  };

  static getShipperDeatils = async (id) => {
    const url = ENDPOINTS.GET_SHIPPER_DETAILS(id, menuConfigUrl.entity);
    const page = "shipper";
    return ApiMethods.get(url, page);
  };

  static getConsigneeDeatils = async (id) => {
    const url = ENDPOINTS.GET_CONSIGNEE_DETAILS(id, menuConfigUrl.entity);
    const page = "consignee";
    return ApiMethods.get(url, page);
  };

  static getIcdDeatils = async (id) => {
    const url = ENDPOINTS.GET_ICD_DETAILS(id, menuConfigUrl.master);
    const page = "shipper";
    return ApiMethods.get(url, page);
  };

  static downloadDocumnent = async (id, source, sourceId) => {
    const url = ENDPOINTS.DOWNLOAD_DOCUMENT(
      id,
      source,
      sourceId,
      menuConfigUrl.entity
    );
    return ApiMethods.get(url);
  };

  static deleteDocument = async (id, source, sourceId) => {
    const url = ENDPOINTS.DOCUMENT_DELETE(
      id,
      source,
      sourceId,
      menuConfigUrl.entity
    );
    return ApiMethods.delete(url);
  };

  static approveCustomerApprove = async (id, type) => {
    const url = ENDPOINTS.CUSTOMER_APPROVE_REQUEST(
      id,
      type,
      menuConfigUrl.entity
    );
    return ApiMethods.put(url);
  };

  static rejectCustomerApprove = async (id, type, remarkMessage) => {
    let payload = { remarks: remarkMessage };
    const url = ENDPOINTS.CUSTOMER_REJECT_REQUEST(
      id,
      type,
      menuConfigUrl.entity
    );
    return ApiMethods.put(url, payload);
  };

  static getUserData = async (id) => {
    const url = ENDPOINTS.GET_USER_DATA(id, menuConfigUrl.admin);
    return ApiMethods.get(url);
  };

  static deleteUser = async (id) => {
    const url = ENDPOINTS.DELETE_USER(id, menuConfigUrl.admin);
    return ApiMethods.delete(url);
  };

  static addUserData = async (payload) => {
    const url = ENDPOINTS.ADD_USER_DATA(menuConfigUrl.admin);
    return ApiMethods.post(url, payload);
  };

  static updateUserData = async (payload) => {
    const url = ENDPOINTS.UPDATE_USER_DATA(menuConfigUrl.admin);
    return ApiMethods.put(url, payload);
  };

  static deleteRole = async (id) => {
    const url = ENDPOINTS.DELETE_ROLE(id, menuConfigUrl.admin);
    return ApiMethods.delete(url);
  };

  static addRole = async (payload) => {
    const url = ENDPOINTS.ADD_ROLE(menuConfigUrl.admin);
    return ApiMethods.post(url, payload);
  };

  static removeAssignedUser = (params) => {
    const url = ENDPOINTS.REMOVE_ASSIGNED_USER(params, menuConfigUrl.admin);
    return ApiMethods.delete(url);
  };

  static getRolepermissions = (id) => {
    const url = ENDPOINTS.GET_ROLE_PERMISSIONS(id, menuConfigUrl.admin);
    return ApiMethods.get(url);
  };

  static getRoles = () => {
    const url = ENDPOINTS.GET_ROLES(menuConfigUrl.admin);
    return ApiMethods.get(url);
  };

  static updateRolePermissions = async (payload) => {
    const url = ENDPOINTS.UPDATE_ROLE_PERMISSIONS(menuConfigUrl.admin);
    return ApiMethods.put(url, payload);
  };

  static userPassReset = async (payload) => {
    const url = ENDPOINTS.USER_PASS_RESET(menuConfigUrl.admin);
    return ApiMethods.put(url, payload);
  };

  static fetchEditVessel = (id) => {
    const url = ENDPOINTS.GET_EDIT_VESSEL(id, menuConfigUrl.master);
    return ApiMethods.get(url);
  };

  static fileDownloadIntegater = async (id) => {
    const url = ENDPOINTS.FILE_DOWNLOAD_INTEGATER(id, menuConfigUrl.entity);
    return ApiMethods.post(url);
  };

  static fetchVesselSuggestions = (inputValue, id) => {
    const url = ENDPOINTS.FETCH_VESSEL_SUGGESTIONS(
      inputValue,
      id,
      menuConfigUrl.admin
    );
    return ApiMethods.get(url);
  };

  static fetchAutoCompleteData = (inputValue, id) => {
    const url = ENDPOINTS.FETCH_AUTOCOMPLETE_DATA(
      inputValue,
      id,
      menuConfigUrl.admin
    );
    return ApiMethods.get(url);
  };

  static updateUserProfile = async (payload) => {
    const url = ENDPOINTS.UPDATE_USER_PROFILE(menuConfigUrl.admin);
    return ApiMethods.put(url, payload);
  };

  static updateUserProfileImage = async (payload, id) => {
    const url = ENDPOINTS.UPDATE_USER_PROFILE_IMAGE(id, menuConfigUrl.admin);
    return ApiMethods.put(url, payload);
  };

  static fetchEditVoyage = (id) => {
    const url = ENDPOINTS.GET_EDIT_VOYAGE(id, menuConfigUrl.master);
    return ApiMethods.get(url);
  };

  static fetchDatasExcel = async ({ query, payload, service, page }) => {
    const queryString = new URLSearchParams(query).toString();
    const url = ENDPOINTS.FETCH_DATA_EXCEL(queryString, service, page);
    return ApiMethods.postBlob(url, payload);
  };

  static getAuditDetails = async (id, page, service) => {
    const url = ENDPOINTS.GET_AUDIT_DATA(id, page, service);
    return ApiMethods.get(url);
  };

  static getDocumentFiles = async (source, id) => {
    const url = ENDPOINTS.GET_DOCUMENT_FILES(source, id, menuConfigUrl.entity);
    return ApiMethods.get(url);
  };

  static getJobEntries = async (limit, page) => {
    const url = ENDPOINTS.GET_JOBENTRIES(limit, page);
    return ApiMethods.get(url);
  };

  static getJobEntryDetails = async (id) => {
    const url = ENDPOINTS.GET_JOBENTRY_DETAILS(id, menuConfigUrl.document);
    return ApiMethods.get(url);
  };
  static getAddRateDetails = async (id) => {
    const url = ENDPOINTS.GET_ADDRATE_DETAILS(id, menuConfigUrl.document);
    return ApiMethods.get(url);
  };
  static updateAddRateDetails = async (payload) => {
    const url = ENDPOINTS.UPDATE_ADDRATE_DETAILS(menuConfigUrl.document);
    return ApiMethods.put(url, payload);
  };

  static approveJobEntryRequest = async (id, type) => {
    const url = ENDPOINTS.JOB_APPROVE_REQUEST(id, type, menuConfigUrl.document);
    return ApiMethods.put(url);
  };
  static approveAllJobEntryRequest = async (type, payload) => {
    const url = ENDPOINTS.ALL_JOBS_APPROVE_REQUEST(
      type,
      menuConfigUrl.document
    );
    return ApiMethods.put(url, payload);
  };
  static rejectjobEntryApprove = async (id, type, remarkMessage) => {
    let payload = { remarks: remarkMessage };
    const url = ENDPOINTS.JOB_ENTRY_REJECT_REQUEST(
      id,
      type,
      menuConfigUrl.document
    );
    return ApiMethods.put(url, payload);
  };

  static getUpdateJobEntryDetails = async (id) => {
    const url = ENDPOINTS.GET_UPDATE_JOBENTRY_DETAILS(
      id,
      menuConfigUrl.document
    );
    return ApiMethods.get(url);
  };
}

export default ApiManager;
