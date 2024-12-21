import CustomerScreen from "./CustomerScreen";
import Main from "../../components/core/main";
import ShipperScreen from "./ShipperScreen";

export default function Component({page}) {
  switch(page)
  {
    case "customer"||"customerApprove":
    return (
      <>
        <Main />
        <CustomerScreen page={page} />
      </>
    )
    case "shipper":
    return (
      <>
        <Main />
        <ShipperScreen page={page} />
      </>
    );
    // case "consignee":
    // return (
    //   <>
    //     <Main />
    //     <ConsigneeScreen page={page} />
    //   </>
    // );
  }
  
}
