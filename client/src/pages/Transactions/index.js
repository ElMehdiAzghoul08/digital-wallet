import React, { useEffect } from "react";
import PageTitles from "../../components/PageTitles";
import { message, Table } from "antd";
import FundsTransfer from "./FundsTransfer";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, showLoading } from "../../redux/loaderSlice";
import { GetTransactionsUser } from "../../apiCalls/transactions";
import moment from "moment";

function Transactions() {
  const [showTransferFund, setShowTransferFund] = React.useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => {
        return moment(text).format("DD-MM-YYYY hh:mm:ss A");
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
        return record.sender === user._id ? "Debit" : "Credit";
      },
    },
    {
      title: "Sender ID",
      dataIndex: "sender",
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
  const [data = [], setData] = React.useState([]);
  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await GetTransactionsUser();
      if (response.success) {
        setData(response.data);
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
      <div className="flex justify-between items-center">
        <PageTitles title="Transactions" />

        <div className="flex gap-1">
          <button className="primary-button-outlined">Deposit </button>
          <button
            className="primary-button-contained"
            onClick={() => setShowTransferFund(true)}
          >
            Transfer{" "}
          </button>
        </div>
      </div>

      <Table columns={columns} dataSource={data} className="margin-top-2" />
      {showTransferFund && (
        <FundsTransfer
          showTransferFund={showTransferFund}
          setShowTransferFund={setShowTransferFund}
        />
      )}
    </div>
  );
}

export default Transactions;
