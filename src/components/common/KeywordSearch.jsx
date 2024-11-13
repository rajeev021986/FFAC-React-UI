import { Formik } from 'formik'
import React from 'react'
import InputBox from '../../components/common/InputBox'
import { Search } from '@mui/icons-material'
import { InputAdornment } from '@mui/material'

export default function KeywordSearch({
  keyword,
  setKeyword,
}) {
  return (
    <Formik
      initialValues={{ search: keyword || '' }}
      onSubmit={() => { }}
    >
      {({ values, errors, handleChange }) => (
        <InputBox
          //   label="Search"
          placeholder="Search..."
          id="search"
          value={values.search}
          error={errors.search}
          onChange={(e) => {
            handleChange(e);
            setKeyword(e.target.value);
          }}
          InputProps={{
            startAdornment: (<InputAdornment position="start">
              <Search color="primary"/>
            </InputAdornment>),
          }}
          sx={{
            mt: 0, mb: 0, '& .MuiInputBase-root': {
              borderRadius: '25px',
            }
          }}
        />
      )}
    </Formik>
  );
}
