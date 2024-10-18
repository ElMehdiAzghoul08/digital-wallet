import React, { useEffect, useState } from "react";
import { getUserInfo } from "../apiCalls/users";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";
import ProtectedLayout from "./ProtectedLayout";
import Loader from "./Loader"; // Import the Loader component

function ProtectedRoute(props) {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // State to manage loading

  const getUserData = async () => {
    try {
      const response = await getUserInfo();
      if (response.success) {
        dispatch(setUser(response.data));
      } else {
        navigate("/login");
        message.error(response.message);
      }
    } catch (error) {
      navigate("/login");
      message.error(error.message);
    } finally {
      setLoading(false); // Stop loading once the data is fetched
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      if (!user) {
        getUserData();
      } else {
        setLoading(false); // Stop loading if user is already present
      }
    } else {
      navigate("/login");
    }
  }, [user, navigate, dispatch]); // Add user to the dependency array

  if (loading) {
    return <Loader />; // Show the loader while loading
  }

  return (
    user && (
      <ProtectedLayout>
        {props.children}{" "}
        {/* This will render the children passed to ProtectedRoute */}
      </ProtectedLayout>
    )
  );
}

export default ProtectedRoute;
