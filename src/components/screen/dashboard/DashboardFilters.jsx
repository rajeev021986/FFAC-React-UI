import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dashboardToggleFilter } from '../../../store/freatures/dashboardSlice';
import FilterChipGroup from '../../common/Filter/FilterChipGroup';
import DashboardSearchForm from './DashboardtSearchForm';


export default function DashboardFilters({ filterInfo }) {
    // Define the filter categories and options
    const selectedFilters = useSelector((state) => state.dashboard);

    const dispatch = useDispatch();

    const handleChipClick = (value, category, type) => {
        dispatch(dashboardToggleFilter({ value, category, type }));
    };


    const filterConfig = [
        {
            title: 'Shipments Status',
            category: 'shipment',
            type: 'radio',
            options: [
                { label: 'All', value: 'ALL' , count : filterInfo?.counts?.all},
                { label: 'Sailed', value: 'SAILED', count : filterInfo?.counts?.sailed },
                { label: 'Arrived (POD)', value: 'ARRIVED', count : filterInfo?.counts?.arrived }
            ]
        },
        {
            title: 'Shipper',
            category: 'shipper',
            type: 'checkbox',
            options: filterInfo?.shipper?.map(item => ({ label: item, value: item }))
        },
        {
            title: 'POL',
            category: 'pol',
            type: 'checkbox',
            options: filterInfo?.pol?.map(item => ({ label: item, value: item }))
        },
        {
            title: 'POD',
            category: 'pod',
            type: 'checkbox',
            options: filterInfo?.pod?.map(item => ({ label: item, value: item }))
        },
    ];

    return (
        <>
            <DashboardSearchForm />
            {filterConfig.map((filterGroup) => (
                <FilterChipGroup
                    key={filterGroup.category}
                    title={filterGroup.title}
                    category={filterGroup.category}
                    type={filterGroup.type}
                    options={filterGroup.options}
                    selectedFilters={selectedFilters[filterGroup.category]}
                    handleChipClick={handleChipClick}
                />
            ))}
        </>
    );
}





