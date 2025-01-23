import ApiManager from "../ApiManager";

export const reloadDataHandler = async (id, page, service, setAuditDetails, setAuditLoading) => {
    try {
        setAuditLoading(true);
        const res = await ApiManager.getAuditDetails(
            id,
            page,
            service
        );
        setAuditDetails(res);
        setAuditLoading(false);
    } catch (error) {
        setAuditLoading(false);
    }
};