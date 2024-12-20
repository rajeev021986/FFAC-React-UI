
import Main from "../../components/core/main";
import ShipperScreen from "./ShipperScreen";

export default function ShipperComponent({page}) {
  return (
    <>
   
      <Main />
      <ShipperScreen page={page} />
    </>
  );
}
