import React, { useEffect, useState } from 'react'
import { Alert, Box, Checkbox, Divider, FormControlLabel, FormGroup, Stack, TextField } from '@mui/material';
import { OutlinedButton, ThemeButton } from '../../../common/Button';
import { useUpdateFormatMutation } from '../../../../store/api/settingsApi';
import { applyFormatting } from './methods';
import InputBox from '../../../common/InputBox';
import SelectBox from '../../../common/SelectBox';
import toast from 'react-hot-toast';


export default function FormatForm({ selectedListItem }) {

    const [inputData, setInputData] = useState({
        currency: selectedListItem.format?.currency || false,
        comma: selectedListItem.format?.comma || false,
        decimal: selectedListItem.format?.decimal || false,
        currencyOrigin : selectedListItem.format?.currencyOrigin || "en-US",
        decimalPoint : selectedListItem.format?.decimalPoint || 2
    });
    const [updateFormat, { isLoading: isLoading }] =
        useUpdateFormatMutation();
    const [formattedValue, setFormattedValue] =
        useState(selectedListItem.value);

    // helper functions
    const handleChange = (formatType, value) => {
        setInputData({
            ...inputData,
            [formatType]: value,
        });
    };
    const handleSubmit = async () => {
        const res = await updateFormat({
            ...selectedListItem,
            format: { ...inputData }
        }).unwrap();
        if(res.status === 'success' ){
            toast.success(res.message);
        }else{
            toast.error("Something Went Wrong")
        }
    };
    const handleReset = async () => {
        setInputData({});
    }


    useEffect(() => {
        setFormattedValue(applyFormatting(inputData, selectedListItem.value));
    }, [inputData, selectedListItem.value]);
    useEffect(() => {
        setInputData({
            currency: selectedListItem.format?.currency || false,
            comma: selectedListItem.format?.comma || false,
            decimal: selectedListItem.format?.decimal || false,
            currencyOrigin : selectedListItem.format?.currencyOrigin || "en-US",
            decimalPoint : selectedListItem.format?.decimalPoint || 2
        })
    }, [selectedListItem.format]);

    return (
        <Box width="40%">
            
                <Stack spacing={2} width="500px">
                    <Stack direction="row">
                        <Box sx={styles.display}>
                            <small>Format display</small>
                            <input
                                type="text"
                                style={styles.input}
                                value={formattedValue}
                                readOnly
                            />
                        </Box>
                    </Stack>
                    <FormGroup>
                        <FormControlLabel
                            label="Currency"
                            control={<Checkbox
                                checked={inputData.currency}
                                onChange={(e) => handleChange("currency", e.target.checked)}
                            />}
                        />
                        {/* <FormControlLabel
                            label="Percentage"
                            control={<Checkbox
                                checked={inputData.percentage}
                                onChange={(e) => handleChange("percentage", e.target.checked)}
                            />}
                        /> */}
                        <FormControlLabel
                            label="Comma"
                            control={<Checkbox
                                checked={inputData.comma}
                                onChange={(e) => handleChange("comma", e.target.checked)}
                            />}
                        />
                        <FormControlLabel
                            label="Decimal"
                            control={<Checkbox
                                checked={inputData.decimal}
                                onChange={(e) => handleChange("decimal", e.target.checked)}
                            />}
                        />

                        <Divider><small>Additional Settings</small></Divider>
                        <Stack spacing={2} direction={"row"} mt={2}>
                            <InputBox
                                id="decimalPoint"
                                label={"Decimal Point"}
                                value={inputData.decimalPoint}
                                onChange={(e) => handleChange("decimalPoint", e.target.value)}
                                type="number"
                            />
                            <SelectBox
                                id="currency"
                                label={"Select Currency"}
                                value={inputData.currencyOrigin}
                                onChange={(e) => handleChange("currencyOrigin", e.target.value)}
                                options={[
                                    {label : "US Dollar ($)", value : "en-US"},
                                    {label : "Euro (€)", value : "en-EU"}
                                ]}
                            />
                        </Stack>
                        
                    </FormGroup>
                    
                    <Stack direction="row" spacing={2} mt={5} justifyContent={"start"}>
                        <OutlinedButton size="small" onClick={handleReset} >Reset</OutlinedButton>
                        <ThemeButton size="small" onClick={handleSubmit}>Save</ThemeButton>
                    </Stack>
                </Stack>
            
        </Box>
    );
}




const styles = {
    display: {
        borderRadius: '10px',
        padding: '10px',
        boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;',
        backgroundColor: 'primary.main',
        border: '1px solid #e0e0e0',
        height: '80px',
        width: '100%',
        color: 'white.main',
        fontFamily: 'monospace',
    },
    input: {
        fontSize: '1.6rem',
        fontFamily: 'monospace',
        width: '100%',
        backgroundColor: 'transparent',
        outline: 'none',
        border: 'none',
        color: '#fff'
    }

}