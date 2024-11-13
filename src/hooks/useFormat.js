import { useSelector } from "react-redux";
import { applyFormatting } from "../components/screen/settings/format/methods";

export const useFormat = () => {
    const allFormat = useSelector((state) => state.settings.format)

    function displayFormat(column, value) {
        const format = allFormat[column];
        if(format === undefined) 
            return value;
        return applyFormatting(format, value);
    }

    return {
        displayFormat
    }
}