import React from 'react';
import FilterChipGroup from '../../common/Filter/FilterChipGroup';
import { useDispatch, useSelector } from 'react-redux';
import { toggleServiceInvoiceFilter } from '../../../store/freatures/serviceInvoiceSlice';
import SISearchForm from './SISearchForm';


export default function SIFilters({filterInfo}) {
  // Define the filter categories and options
  const selectedFilters = useSelector((state) => state.serviceInvoice);

  const dispatch = useDispatch();

  const handleChipClick = (value, category) => {
    dispatch(toggleServiceInvoiceFilter({ value, category }));
  };


  const filterConfig = [
    {
      title: 'Filter',
      category: 'status',
      options: [
        { label: `All SI (${filterInfo.allsi})`, value: 'all_si_count' },
        { label: `Received (${filterInfo.allsireceived})`, value: 'received_count' },
        { label: `Duplicate (${filterInfo.allsiduplicate})`, value: `duplicate_count` },
        { label: `SI not sent to SPR (${filterInfo.allsinotsent})`, value: `not_sentto_spr_count` },
        { label: `SI Not Verified (${filterInfo.allsinotverified})`, value: `not_verified_spr_count` },
        { label: `SI Sent Today (${filterInfo.sisent})`, value: `si_snt` },
        { label: `All SI Sent (${filterInfo.allsisent})`, value: `sentto_spr_count` },
        // { label: `SI Sent to SPR (${filterInfo.allsisent})`, value: `sentto_spr_count` }
      ]
    }
  ];

  return (
    <>
    <SISearchForm />
      {filterConfig.map((filterGroup) => (
        <FilterChipGroup
          key={filterGroup.category}
          title={filterGroup.title}
          category={filterGroup.category}
          options={filterGroup.options}
          selectedFilters={selectedFilters[filterGroup.category]}
          handleChipClick={handleChipClick}
        />
      ))}
    </>
  );
}





