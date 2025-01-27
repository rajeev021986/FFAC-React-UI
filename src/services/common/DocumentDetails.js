import ApiManager from "../ApiManager";

export const reloadDataHandler = async (source, id, setListData, setLoading) => {
    try {
        setLoading(true);
        const res = await ApiManager.getDocumentFiles(source, id);
        setListData(res.body);
        setLoading(false);
    } catch (error) {
        setLoading(false);
    }
};