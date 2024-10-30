import React, { useEffect, useState } from "react";
import { getUserInfo } from "../apiCalls/users";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ReloadUser, setUser } from "../redux/userSlice";
import ProtectedLayout from "./ProtectedLayout";
import Loader from "./Loader";

const ProtectedRoute = ({ children }) => {
  const { user, reloadUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      const response = await getUserInfo();
      if (response.success) {
        dispatch(setUser(response.data));
      } else {
        navigate("/login");
        message.error(response.message);
      }
      dispatch(ReloadUser(false));
    } catch (error) {
      navigate("/login");
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!user) {
      getData();
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (reloadUser) {
      getData();
    }
  }, [reloadUser]);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return null;
  }

  return <ProtectedLayout>{children}</ProtectedLayout>;
};

export default ProtectedRoute;
