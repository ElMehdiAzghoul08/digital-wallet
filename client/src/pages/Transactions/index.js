import React, { useEffect } from "react";
import PageTitles from "../../components/PageTitles";
import { message, Table, Button } from "antd"; // Importing Button from Ant Design
import FundsTransfer from "./FundsTransfer";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, showLoading } from "../../redux/loaderSlice";
import { GetTransactionsUser } from "../../apiCalls/transactions";
import moment from "moment";
import DepositFunds from "./DepositFunds";

function Transactions() {
  const [showTransferFund, setShowTransferFund] = React.useState(false);
  const [showDepositFunds, setShowDepositFunds] = React.useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const columns = [
    {
      title: "Date",
      dataIndex: "createdAt",
      sorter: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      render: (text, record) => {
        return moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss A");
      },
    },
    {
      title: "Transaction ID",
      dataIndex: "_id",
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (text, record) => {
        if (record.type === "deposit") {
          return "Deposit";
        } else if (record.sender?._id === user?._id) {
          return "Debit";
        } else if (record.receiver?._id === user?._id) {
          return "Credit";
        }
        return "Unknown";
      },
    },
    {
      title: "Sender",
      dataIndex: "sender",
      render: (sender) => {
        if (sender?.firstName && sender?.lastName) {
          return `${sender.firstName} ${sender.lastName}`;
        }
        return (
          sender?.firstName || sender?.lastName || sender?.name || "Unknown"
        );
      },
    },
    {
      title: "Reference",
      dataIndex: "reference",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  const [data, setData] = React.useState([]);

  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await GetTransactionsUser();
      if (response.success) {
        const sortedData = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setData(sortedData);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center ">
        <PageTitles title="Transactions" />
        <div className="flex gap-1">
          <Button
            style={{
              backgroundColor: "#037dd6",
              color: "#fff",
              borderColor: "#037dd6",
              height: "50px",
              width: "150px",
              fontSize: "15px",
            }} // Custom color for Deposit
            onClick={() => setShowDepositFunds(true)}
          >
            Deposit
          </Button>
          <Button
            style={{
              backgroundColor: "#037dd6",
              color: "#fff",
              borderColor: "#037dd6",
              height: "50px",
              width: "150px",
              fontSize: "15px",
            }} // Same custom color for Transfer
            onClick={() => setShowTransferFund(true)}
          >
            Transfer
          </Button>
        </div>
      </div>
      <Table columns={columns} dataSource={data} className="margin-top-2" />
      {showTransferFund && (
        <FundsTransfer
          showTransferFund={showTransferFund}
          setShowTransferFund={setShowTransferFund}
          reloadData={getData}
        />
      )}
      {showDepositFunds && (
        <DepositFunds
          showDepositFunds={showDepositFunds}
          setShowDepositFunds={setShowDepositFunds}
          reloadData={getData}
        />
      )}
    </div>
  );
}

export default Transactions;
