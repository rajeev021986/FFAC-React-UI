import { Box, Stack } from '@mui/material'
import React from 'react'
import ThemeTabs from '../../common/Tab/ThemeTab'
import InputBox from '../../common/InputBox'
import ThemedMultiselect from '../../common/ThemedMultiselect'
import ChipAutocomplete from '../../common/ChipAutocomplete'


const TAB_OPTIONS = [
    {label:'MTR Sheet Filter',value:'1'},
    {label:'MTR Sheet Column Config',value:'2'}
]


export default function MtrConfigForm({
    formik,
    options
}) {
  return (
        <ThemeTabs tabData={TAB_OPTIONS}>
            <MTRSheetFilter formik={formik} />
            <MTRSheetColumnConfig formik={formik} options={options} />
        </ThemeTabs>
  )
}


function MTRSheetFilter({formik}){
    return (
            <Stack direction="row" spacing={2} >
                <InputBox
                    label="Move Filter Type"
                    id="filter_movetype"
                    placeholder="Enter coma separated values"
                    value={formik.values.filter_movetype}
                    error={formik.errors.filter_movetype }
                    onChange={formik.handleChange} />
                <InputBox
                    label="SCAC Code Filter"
                    id="filter_scac_code"
                    placeholder="Enter coma separated values"
                    value={formik.values.filter_scac_code}
                    error={formik.errors.filter_scac_code }
                    onChange={formik.handleChange} />
            </Stack>
    )
}

function MTRSheetColumnConfig({formik,options}){
    return (
        <Stack direction="row" spacing={2} width={"100%"} >
            <ChipAutocomplete 
                options={options}
                label="Select Columns"
                id="ctypelist"
                placeholder="Select Columns"
                preValue={formik.values.ctypelist}
                error={formik.errors.ctypelist}
                formik={formik}
            />
        </Stack>
    )
}
