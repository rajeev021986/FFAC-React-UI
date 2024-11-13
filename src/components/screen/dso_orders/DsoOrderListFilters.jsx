import React from 'react';
import FilterChipGroup from '../../common/Filter/FilterChipGroup';
// import { makeCapitalized } from '../../utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import { togglePackingListFilter } from '../../../store/freatures/packingListSlice';
// import PackingListSearchForm from './PackingListSearchForm';
// import PoOrderListSearchForm from './PoOrderListSearchForm';
import DsoOrderListSearchForm from './DsoOrderListSearchForm';


export default function DsoOrderListFilters({filterInfo}) {
  // Define the filter categories and options
  const selectedFilters = useSelector((state) => state.packingList);

  const dispatch = useDispatch();

  const handleChipClick = (value, category) => {
    dispatch(togglePackingListFilter({ value, category }));
  };


  // const filterConfig = [
  //   {
  //     title: 'Status',
  //     category: 'status',
  //     options: [
  //       { label: `All PL (${filterInfo.allpl})`, value: 'all_pl' },
  //       { label: `New PL Received (${filterInfo.newplreceived})`, value: 'new_pl_count' },
  //       { label: `Booking Confirmation Sent (${filterInfo.bookingconfirmsent})`, value: `b_conf_count` },
  //       { label: `PL Received awaiting booking (${filterInfo.plrabc})`, value: `pl_recv_awt_bk` },
  //       { label: `PL Final Received (${filterInfo.plfinalreceived})`, value: `pl_fnl_rcv` },
  //       { label: `Final PL awaiting BOL (${filterInfo.finalplabolg})`, value: `fnl_pl_awt_bl` },
  //       { label: `BOL issued waiting SI (${filterInfo.bolwfsi})`, value: `bl_isu_awt_si` }
  //     ]
  //   }
  // ];

  return (
    <>
      <DsoOrderListSearchForm />
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





