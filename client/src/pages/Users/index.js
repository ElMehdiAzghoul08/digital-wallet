import React, { useEffect } from "react";
import { getAllUsers, updateVerificationStatus } from "../../apiCalls/users";
import { HideLoading, showLoading } from "../../redux/loaderSlice";
import { useDispatch } from "react-redux";
import { message, Table, Button } from "antd";
import PageTitles from "../../components/PageTitles";

function Users() {
  const [Users, setUsers] = React.useState([]);
  const dispatch = useDispatch();

  const updateStatus = async (record, isVerified) => {
    try {
      dispatch(showLoading());
      const response = await updateVerificationStatus({
        selectedUser: record._id,
        isVerified,
      });
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };

  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await getAllUsers();
      dispatch(HideLoading());
      if (response.success) {
        setUsers(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
    },
    {
      title: "Verified",
      dataIndex: "isVerified",
      render: (text, record) => {
        return text ? "Yes" : "No";
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        const isVerified = record.isVerified;
        return (
          <div className="flex gap-1">
            <Button
              type="primary"
              onClick={() => updateStatus(record, !isVerified)}
              style={{
                backgroundColor: isVerified ? "#f5222d" : "#52c41a",
                borderColor: isVerified ? "#f5222d" : "#52c41a",
                color: "#fff",
              }}
            >
              {isVerified ? "Suspend" : "Activate"}
            </Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <PageTitles title="Users" />
      <Table dataSource={Users} columns={columns} className="margin-top-2" />
    </div>
  );
}

export default Users;
