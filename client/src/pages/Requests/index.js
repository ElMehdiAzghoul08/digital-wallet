import React, { useEffect, useState } from "react";
import { message, Table, Tabs, Button, Spin } from "antd"; // Import Spin for loading indicator
import PageTitles from "../../components/PageTitles";
import RequestModal from "./RequestModal";
import {
  GetRequestsByUser,
  UpdateRequestStatus,
} from "../../apiCalls/requests";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, showLoading } from "../../redux/loaderSlice";
import moment from "moment";
import { ReloadUser } from "../../redux/userSlice";

const { TabPane } = Tabs;

function Requests() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [data, setData] = useState({ sent: [], received: [] });
  const [loading, setLoading] = useState(false); // State for loading indication

  const getData = async () => {
    try {
      setLoading(true); // Start loading
      dispatch(showLoading());
      const response = await GetRequestsByUser();
      if (response.success) {
        const sentData = response.data.filter(
          (item) => item.sender._id === user._id
        );
        const receivedData = response.data.filter(
          (item) => item.receiver._id === user._id
        );
        setData({ sent: sentData, received: receivedData });
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false); // Stop loading
      dispatch(HideLoading());
    }
  };

  const UpdateStatus = async (record, status) => {
    try {
      if (status === "accepted" && record.amount > user.balance) {
        message.error("Insufficient funds");
        return;
      }
      dispatch(showLoading());
      const response = await UpdateRequestStatus({ ...record, status });
      if (response.success) {
        message.success(response.message);
        getData();
        dispatch(ReloadUser(true));
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(HideLoading());
    }
  };

  const columns = [
    { title: "Request ID", dataIndex: "_id" },
    {
      title: "User",
      dataIndex: "sender",
      render: (sender) =>
        `${sender?.firstName || "Unknown"} ${sender?.lastName || ""}`,
    },
    {
      title: "Receiver",
      dataIndex: "receiver",
      render: (receiver) =>
        `${receiver?.firstName || "Unknown"} ${receiver?.lastName || ""}`,
    },
    { title: "Amount", dataIndex: "amount" },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (text, record) =>
        moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss A"),
    },
    { title: "Status", dataIndex: "status" },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        if (record.status === "pending" && record.receiver._id === user._id) {
          return (
            <div className="gap-1 flex">
              <Button
                type="primary"
                danger
                onClick={() => UpdateStatus(record, "rejected")}
              >
                Reject
              </Button>
              <Button
                type="primary"
                onClick={() => UpdateStatus(record, "accepted")}
                style={{ backgroundColor: "green", borderColor: "green" }}
              >
                Accept
              </Button>
            </div>
          );
        }
      },
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        <PageTitles title="Requests" />
        <Button
          type="primary"
          onClick={() => setShowRequestModal(true)}
          className="primary-button-outlined" // Match your other button styling
          style={{
            backgroundColor: "#037dd6",
            color: "#fff",
            borderColor: "#037dd6",
            height: "50px",
            width: "150px",
            fontSize: "15px",
          }} // Optional: Add margin if needed
        >
          Request Funds
        </Button>
      </div>

      {loading ? (
        <Spin size="large" /> // Show loading spinner while data is being fetched
      ) : (
        <Tabs defaultActiveKey="1">
          <TabPane tab="Sent" key="1">
            {data.sent.length > 0 ? (
              <Table columns={columns} dataSource={data.sent} />
            ) : (
              <div>No sent requests</div>
            )}
          </TabPane>
          <TabPane tab="Received" key="2">
            {data.received.length > 0 ? (
              <Table columns={columns} dataSource={data.received} />
            ) : (
              <div>No received requests</div>
            )}
          </TabPane>
        </Tabs>
      )}
      {showRequestModal && (
        <RequestModal
          showRequestModal={showRequestModal}
          setShowRequestModal={setShowRequestModal}
          reloadData={getData}
        />
      )}
    </div>
  );
}

export default Requests;
