import React, { useEffect } from "react";
import { useAuth } from "../../Middleware/auth";
import { useState } from "react";
import { AutobotBackend } from "../../Middleware/Helper";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "./../Loader/Loader";
import "./repairhistory.css";
export default function HistoryRepair() {
  const auth = useAuth();
  const [result, setResult] = useState(null);
  function deleteProduct(id) {
    axios.delete(`${AutobotBackend}/api/deletehistory/${id}`,
      {
        params: {}
      }).then((response) => {
        toast.info("Removed successfully", {
          position: "top-left",
          theme: "dark",
        });
      }).catch((error) => {
        console.log(error);
      })
  }
  useEffect(() => {
    axios
      .get(`${AutobotBackend}/api/repairhistory/${auth.user}`, {})
      .then((response) => {
        setResult(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [result, auth.user]);

  return (
    <>
      <div className="modal fade modal-lg" id="repairhistory" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content ">
            <div className="modal-header">
              {
                auth.user &&
                <h1 className="modal-title fs-5" id="exampleModalLabel">{auth.user}'s repair requests</h1>
              }
              {
                !auth.user &&
                <h1 className="modal-title fs-5" id="exampleModalLabel">Cart</h1>
              }
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">CarName</th>
                  <th scope="col">Date</th>
                  <th scope="col">City</th>
                  <th scope="col">Delete</th>
                </tr>
              </thead>
              <tbody>
                {result ? (
                  result.map((obj, key) => (

                    <tr key={key}>
                      <td>{obj.name}</td>
                      <td>{obj.carname}</td>
                      <td>{obj.date}</td>
                      <td>{obj.city}</td>
                      <td className="service-delete"><i className="fa fa-trash-o fa-lg" onClick={() => deleteProduct(obj._id)}></i></td>
                    </tr>
                  ))
                ) : (
                  <Loader />
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}