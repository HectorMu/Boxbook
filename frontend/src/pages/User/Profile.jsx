import React from "react";
import EditForm from "../../containers/User/Profile/EditForm";
import useSession from "../../hooks/useSession";

const Profile = () => {
  return (
    <div className="d-flex justify-content-center mt-5">
      <div className="col-12 col-lg-8">
        <div className="d-flex justify-content-center">
          <i className="fas fa-user fa-7x"></i>
        </div>
        <EditForm />
      </div>
    </div>
  );
};

export default Profile;
