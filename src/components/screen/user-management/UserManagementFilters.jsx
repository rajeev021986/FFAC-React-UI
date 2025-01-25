import React from "react";
import FilterForm from "./FilterForm";
import FilterChipGroup from "../../common/Filter/FilterChipGroup";
import { makeCapitalized } from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { toggleFilter } from "../../../store/freatures/userManagementSlice";

export default function UserManagementFilters({ setFilterOpen }) {
  return (
    <>
      <FilterForm setFilterOpen={setFilterOpen} />
    </>
  );
}
