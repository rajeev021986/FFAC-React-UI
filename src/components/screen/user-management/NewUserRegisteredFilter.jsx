import React from 'react';
// import FilterForm from './FilterForm';
// import FilterChipGroup from '../../common/Filter/FilterChipGroup';
// import { makeCapitalized } from '../../utils/utils';
// import { useDispatch, useSelector } from 'react-redux';
// import { toggleFilter } from '../../../store/freatures/userManagementSlice';
import NewRegisterdUserFilterForm from './NewRegisterdUserFilterForm';


export default function NewUserRegisteredFilter() {
  // Define the filter categories and options
  // const selectedFilters = useSelector((state) => state.userManagement);

  // const dispatch = useDispatch();

  // const handleChipClick = (value, category) => {
  //   dispatch(toggleFilter({ value, category }));
  // };


  // const filterConfig = [
  //   {
  //     title: 'Role',
  //     category: 'role',
  //     options: filterInfo?.map((item) => {
  //       return { label: makeCapitalized(item.role) , value: item.role, count : item.count };
  //     })
  //   },
  //   {
  //     title: 'Status',
  //     category: 'status',
  //     options: [
  //       { label: 'Active', value: 'Active' },
  //       { label: 'Inactive', value: 'Inactive' }
  //     ]
  //   }
  // ];

  return (
    <>
      <NewRegisterdUserFilterForm />
      {/* {filterConfig.map((filterGroup) => (
        <FilterChipGroup
          key={filterGroup.category}
          title={filterGroup.title}
          category={filterGroup.category}
          options={filterGroup.options}
          selectedFilters={selectedFilters[filterGroup.category]}
          handleChipClick={handleChipClick}
        />
      ))} */}
    </>
  );
}





