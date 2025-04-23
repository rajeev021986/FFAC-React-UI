import React from "react";
import CardItemUser from "./CardItemUser";

export default function CardItem({
  item,
  columns,
  selectedBox,
  setSelectedBox,
  uniqueId,
  actions,
  icon,
  page,
}) {
  columns = columns.filter(
    (column) => column.field !== "id" && column.field !== "action"
  );

  return (
    <CardItemUser
      item={item}
      columns={columns}
      selectedBox={selectedBox}
      setSelectedBox={setSelectedBox}
      uniqueId={uniqueId}
      actions={actions}
      icon={icon}
      page={page}
    />
  );
}
