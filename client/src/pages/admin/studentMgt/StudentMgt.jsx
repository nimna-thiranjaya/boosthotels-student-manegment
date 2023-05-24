import React, { useEffect, useState } from "react";
import {
  Space,
  Table,
  Tag,
  Input,
  message,
  Card,
  Popconfirm,
  Select,
} from "antd";
import NavBar from "../../../components/navBar/NavBar";
import CustomFooter from "../../../components/footer/CustomFooter";
import Search from "antd/es/transfer/search";
import { FileExcelOutlined, DownloadOutlined } from "@ant-design/icons";
import "./studentmgt.css";
import { Button } from "antd/es/radio";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import years from "../../../data/data";
import axios from "axios";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";

const StudentMgt = () => {
  //Pagination
  const [page, setPage] = useState(1);
  const [studentLength, setStudentLength] = useState(0);
  const [totalStudents, setTotalStudents] = useState([]);
  const [tempData, setTempData] = useState([]); //table data [array

  //Pagination
  const handlePaginationChange = (value) => {
    if (value == 1) {
      setPage(1);
    } else {
      setPage(value);
    }
  };

  const [students, setStudents] = useState([]);
  const [tempStudents, setTempStudents] = useState([]);
  const [studyYear, setStudyYear] = useState("");

  useEffect(() => {
    getAllStudents();
  }, []);

  //Get all students
  const getAllStudents = async () => {
    try {
      const res = await axios.get("/user/getAllUsers");
      setStudents(res.data.students);
      setTempStudents(res.data.students);
      setTotalStudents(res.data.students);
      setStudentLength(res.data.students.length);
    } catch (err) {
      console.error(err);
    }
  };

  //Delete student
  const onDelete = (id) => async () => {
    try {
      const res = await axios.delete(`/user/delete/${id}`);
      if (res.data) {
        message.success("Student deleted successfully");
        getAllStudents();
      }
    } catch (err) {
      message.error("Something went wrong");
    }
  };

  //Search student
  const onSearch = (value) => {
    const searchKey = value.target.value;
    if (searchKey) {
      StudentFilter(searchKey, tempStudents);
    } else {
      getAllStudents();
    }
  };

  //Filter student by study year
  const onFilter = (value) => {
    setStudyYear(value);
    if (value === "All") {
      getAllStudents();
    } else if (value) {
      const filterData = tempStudents.filter((data) => {
        if (data.studyYear === value) {
          return data;
        }
      });
      setStudents(filterData);
    } else {
      getAllStudents();
    }
  };

  //Filter student function (Search helper function)
  const StudentFilter = (key, datas) => {
    const filterData = datas.filter((data) => {
      if (data.fullName.toLowerCase().includes(key.toLowerCase())) {
        return data;
      }
    });
    setStudents(filterData);
  };

  //Export to excel
  const exportToExcel = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    const tempStudents = students.map((data) => {
      return {
        fullName: data.fullName,
        email: data.email,
        university: data.university,
        studyYear: data.studyYear,
        createdAt: data.createdAt.slice(0, 10),
      };
    });
    const fileName = "Student-Report " + Date.now();
    const ws = XLSX.utils.json_to_sheet(tempStudents);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const columns = [
    {
      title: "Picture",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl) => <img src={imageUrl} className="circle-image" />,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "University Name",
      dataIndex: "university",
      key: "university",
    },
    {
      title: "Study Year",
      dataIndex: "studyYear",
      key: "studyYear",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => {
        return <Moment format="YYYY/MM/DD">{createdAt}</Moment>;
      },
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      render: (_id) => {
        return (
          <Space size="middle">
            <Link to={`/studentUpdate/${_id}`}>
              <Button
                type="primary"
                size="large"
                style={{
                  backgroundColor: "blue",
                  color: "white",
                }}
              >
                Edit
              </Button>
            </Link>
            <Popconfirm
              title="Delete Confirmation"
              description="Are you sure, You want to delete this student?"
              okText="Yes"
              cancelText="No"
              onConfirm={onDelete(_id)}
              onCancel={() => {}}
            >
              <Button
                type="primary"
                size="large"
                style={{
                  backgroundColor: "red",
                  color: "white",
                }}
              >
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <NavBar />
      <div className="std-mgt-container">
        <Card
          style={{
            boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
          }}
        >
          <div className="text-end search-container">
            <div className="download-report" onClick={exportToExcel}>
              <div>
                <FileExcelOutlined className="download-icon" />
              </div>
              <div>Download Report</div>
            </div>

            <Select
              placeholder="Select your year and semester"
              onChange={(e) => onFilter(e)}
              style={{ width: "180px" }}
            >
              {<Select.Option value="All">All</Select.Option>}
              {years.map((year) => (
                <Select.Option value={year.value}>{year.lable}</Select.Option>
              ))}
            </Select>

            <Space direction="vertical">
              <Search
                onChange={(e) => onSearch(e)}
                placeholder="input search text"
                enterButton
              />
            </Space>
          </div>
        </Card>
        <Card
          style={{ marginTop: 16, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}
        >
          <Table
            columns={columns}
            dataSource={students}
            pagination={{
              onChange: handlePaginationChange,
              defaultPageSize: 4,
              showSizeChanger: false,
              total: studentLength,
              defaultCurrent: 1,
            }}
          />
        </Card>
      </div>

      <CustomFooter />
    </div>
  );
};

export default StudentMgt;
