import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./components/common/Loader/Loader";
import ApiManager from "./services/ApiManager";
import { useDispatch } from "react-redux";
import { login } from "./store/freatures/authSlice";

const HandleAuthCallback = () => {
  const { user, isAuthenticated, isLoading, getIdTokenClaims } = useAuth0();
  const dispatch = useDispatch();

  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      console.log(user);
      (async () => {
        try {
          const token = await getIdTokenClaims();
          const result = await ApiManager.CheckUser({
            emailid: user.email,
            firstname: user.given_name,
            lastname: user.family_name,
          });
          console.log("result : ", result);

          if (result.status === "error") throw new Error(result.message,{cause : 'registered'});
          else if (result.status === "success" && !result.isLogin)
            throw new Error(result.message,{cause : "new_register"});

          dispatch(
            login({
              token: token.__raw,
              user: result.user,
              authtype: "auth0",
            })
          );
          console.log("Login Success : ",result);
          
          navigate("/app");
        } catch (error) {
          console.log(error.cause);
          navigate("/register_user", {
            state: {
              message: error.message,
              cause : error.cause
            },
          });
        }
      })();
    }
  }, [isAuthenticated, user, getIdTokenClaims, navigate, dispatch]);

  if (isLoading) {
    return <Loader screen="full" />;
  }

  //   return (
  //     isAuthenticated && (
  //       <div style={{width : "50%",padding : "20px"}}>

  //       </div>
  //     )
  //   );
};
export default HandleAuthCallback;
