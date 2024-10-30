import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PageTitles from "../../components/PageTitles";
import visaLogo from "./images/visa-svg.svg";
import { getUserInfo } from "../../apiCalls/users";
import { setUser } from "../../redux/userSlice";
import { message } from "antd";

function Home() {
  const { user, reloadUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const getCurrentUser = async () => {
    try {
      const response = await getUserInfo();
      if (response.success) {
        dispatch(setUser(response.data));
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (reloadUser) {
      getCurrentUser();
    }
  }, [reloadUser]);

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <div>
      <PageTitles
        title={`Hello ${user.firstName} ${user.lastName}, Welcome to your E-Waves`}
      />

      {/* Flex Container for Cards */}
      <div className="flex margin-top-3">
        {/* Credit card-2 Style Section */}
        <div className="card-2">
          <div className="top">
            <div className="title">Digital Wallet Card</div>
            <div className="icon">
              <img src={visaLogo} alt="Visa Logo" />
            </div>
          </div>
          <div className="mid">
            <div className="mid-title">Card Balance</div>
            <div className="amount">${user.balance || 0}</div>
          </div>
          <div className="bottom">
            <div className="card-2-num">{user._id}</div>
            <div className="valid-thru">12/26</div>
          </div>
        </div>

        {/* Additional User Details */}
        <div className="card-1 p-2 margin-left-3 width-50 border-radius-3 uppercase flex flex-col gap-2">
          {[
            { label: "First Name", value: user.firstName },
            { label: "Last Name", value: user.lastName },
            { label: "Email", value: user.email },
            { label: "Phone Number", value: user.phoneNumber },
            { label: "Identification Type", value: user.identificationType },
            {
              label: "Identification Number",
              value: user.identificationNumber,
            },
          ].map((item, index) => (
            <div key={index} className="flex justify-between">
              <h1 className="text-m">{item.label}:</h1>
              <h1 className="text-m">{item.value}</h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
