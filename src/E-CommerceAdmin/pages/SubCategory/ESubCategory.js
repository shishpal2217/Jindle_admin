/** @format */
import React, { useEffect, useState } from "react";
import HOC from "../../layout/HOC";
import { Table, Modal, Form, Button, Alert } from "react-bootstrap";
import { Dropdown, Menu } from "antd";
import BreadCamp from "../Component/BreadCamp";
import axios from "axios";
import BaseUrl from "../../../BaseUrl";
import { nofification } from "../../utils/utils.js";
import { FaFilePdf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ESubCategory = () => {
  const navigate = useNavigate();
  const [modalShow, setModalShow] = React.useState(false);
  const [edit, setEdit] = useState("");
  const [data, setData] = useState([]);
  const [id, setId] = useState("");

  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `${BaseUrl()}api/career/get-all-application`
      );
      setData(data?.data);
    } catch (e) {
     
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `${BaseUrl()}api/career/delete-application/${id}`
      );
      nofification("Application Deleted Successfully", "success");
      fetchData();
    } catch (e) {
  
    }
  };

  // Pagination and Filter
  const [query, setQuery] = useState("");
  const [currentPage2, setCurrentPage2] = useState(1);
  const [postPerPage2] = useState(10);
  const lastPostIndex2 = currentPage2 * postPerPage2;
  const firstPostIndex2 = lastPostIndex2 - postPerPage2;

  let pages2 = [];

  const TotolData = query
    ? data?.filter((i) =>
        [
          `${i?.firstName} ${i?.lastName}`,
          i?.email,
          i?.phone,
          i?.jobId,
          i?.location,
          i?.jobTitle,
        ].some((field) => field?.toLowerCase().includes(query?.toLowerCase()))
      )
    : data;

  useEffect(() => {
    if (query) {
      setCurrentPage2(1);
    }
  }, [query]);

  const slicedData = TotolData?.slice(firstPostIndex2, lastPostIndex2);

  for (let i = 1; i <= Math.ceil(TotolData?.length / postPerPage2); i++) {
    pages2.push(i);
  }

  function Next() {
    setCurrentPage2(currentPage2 + 1);
  }

  function Prev() {
    if (currentPage2 !== 1) {
      setCurrentPage2(currentPage2 - 1);
    }
  }

  function MyVerticallyCenteredModal(props) {
    const [adminMessage, setAdminMessage] = useState("");
    const [status, setStatus] = useState("");

    const postHandler = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.post(
          `${BaseUrl()}api/career/applications/${id}/reply`,
          {
            adminMessage,
            status,
          }
        );
        nofification("Mail send applicant Successfully", "success");
        props.onHide();
      } catch (e) {
       
      }
    };

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {" "}
            {edit ? "Send Application in Response to Applicant" : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={postHandler}>
            <Form.Group className="mb-3">
              <Form.Label>Send Message</Form.Label>
              <Form.Control
                as="textarea"
                row={3}
                value={adminMessage}
                onChange={(e) => setAdminMessage(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Select
              aria-label="Default select example"
              className="mb-3"
              required
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>-- Select Status --</option>
              <option value={"pending"}>Pending</option>
              <option value={"reviewed"}>Reviewed</option>
              <option value={"processed"}>Processed</option>
              <option value={"rejected"}>Rejected</option>
            </Form.Select>

            <Button
              style={{
                backgroundColor: "#19376d",
                borderRadius: "0",
                border: "1px solid #19376d",
              }}
              type="submit"
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />

      <section>
        <BreadCamp name="Apllicants" />
        <div
          className="pb-4   w-full flex justify-between items-center"
          style={{ width: "98%", marginLeft: "2%" }}
        >
          <span
            className="tracking-widest text-slate-900 font-semibold uppercase"
            style={{ fontSize: "1.5rem" }}
          >
            All Apllicants ( Total : {data?.length} )
          </span>
          {/* <button
            onClick={() => {
              setEdit(false);
              setModalShow(true);
            }}
            className="md:py-2 px-3 md:px-4 py-1 rounded-sm bg-[#19376d] text-white tracking-wider"
          >
            Add Career
          </button> */}
        </div>

        <section className="sectionCont">
          {data?.length === 0 || !data ? (
            <Alert>Apllicants Not Found</Alert>
          ) : (
            <>
              <div className="filterBox">
                <img
                  src="https://t4.ftcdn.net/jpg/01/41/97/61/360_F_141976137_kQrdYIvfn3e0RT1EWbZOmQciOKLMgCwG.jpg"
                  alt=""
                />
                <input
                  type="search"
                  placeholder="Search By Apllicants Name"
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className="overFlowCont">
                <Table>
                  <thead>
                    <tr>
                      <th>SNo.</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Job Id</th>
                      <th>Location</th>
                      <th>Job Title</th>
                      <th>cv_file</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {slicedData?.map((i, index) => (
                      <tr key={index}>
                        <td>#{index + 1} </td>
                        <td>{`${i.firstName} ${i.lastName}`} </td>
                        <td> {i?.email} </td>
                        <td> {i?.phone} </td>
                        <td> {i?.jobId} </td>
                        <td> {i?.location} </td>
                        <td> {i?.jobTitle} </td>
                        <td>
                          <a
                            href={`https://ashpro-backend.onrender.com/${i?.cv_file}`}
                            target="_blank"
                          >
                            <FaFilePdf size={25} />
                          </a>
                        </td>
                        <td>
                          <Dropdown
                            overlay={
                              <Menu>
                                 <Menu.Item key="1">
                                  <div
                                    className="two_Sec_Div"
                                    onClick={() => {
                                      navigate(`/application/${i?._id}`);
                                    }}
                                  >
                                    <i className="fa-solid fa-eye"></i>
                                    <p>View Info</p>
                                  </div>
                                </Menu.Item>
                                <Menu.Item key="2">
                                  <div
                                    className="two_Sec_Div"
                                    onClick={() => {
                                      setId(i?._id);
                                      setEdit(true);
                                      setModalShow(true);
                                    }}
                                  >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                    <p>Send Mail</p>
                                  </div>
                                </Menu.Item>
                                <Menu.Item key="3">
                                  <div className="two_Sec_Div">
                                    <i className="fa-sharp fa-solid fa-trash"></i>
                                    <p onClick={() => handleDelete(i._id)}>
                                      Delete{" "}
                                    </p>
                                  </div>
                                </Menu.Item>
                              </Menu>
                            }
                            trigger={["click"]}
                          >
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {/* Pagination */}
                <div className="pagination">
                  <button onClick={() => Prev()} className="prevBtn">
                    <i className="fa-solid fa-backward"></i>
                  </button>
                  {currentPage2 === 1 ? (
                    ""
                  ) : (
                    <button onClick={() => setCurrentPage2(1)}>1</button>
                  )}

                  {pages2
                    ?.slice(currentPage2 - 1, currentPage2 + 3)
                    .map((i, index) =>
                      i === pages2?.length ? (
                        ""
                      ) : (
                        <button
                          key={index}
                          onClick={() => setCurrentPage2(i)}
                          className={currentPage2 === i ? "activePage" : ""}
                        >
                          {" "}
                          {i}{" "}
                        </button>
                      )
                    )}

                  <button
                    onClick={() => setCurrentPage2(pages2?.length)}
                    className={
                      currentPage2 === pages2?.length ? "activePage" : ""
                    }
                  >
                    {" "}
                    {pages2?.length}{" "}
                  </button>

                  {currentPage2 === pages2?.length ? (
                    ""
                  ) : (
                    <button onClick={() => Next()} className="nextBtn">
                      {" "}
                      <i className="fa-sharp fa-solid fa-forward"></i>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </section>
    </>
  );
};

export default HOC(ESubCategory);
