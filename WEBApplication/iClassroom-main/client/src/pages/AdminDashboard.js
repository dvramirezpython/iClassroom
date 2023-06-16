import {React, useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import SideBar from '../components/admin/SideBar';
import Schools from '../components/admin/Schools';
import Teachers from '../components/admin/Teachers';
import Students from '../components/admin/Students';
import Admins from '../components/admin/Admins';
import Areas from '../components/admin/Areas';
import Subjects from '../components/admin/Subjects';
import Supervisors from '../components/admin/Supervisors';
import Degrees from '../components/admin/Degrees';
import Rooms from '../components/admin/Rooms';
import Groups from '../components/admin/Groups';
import AccountsApproval from '../components/admin/AccountsApproval';
import Engagement from '../components/admin/Engagement';
import Distractors from '../components/admin/Distractors';
import Attention from '../components/admin/Attention';
import Interaction from '../components/admin/Interaction';
import Events from '../components/admin/Events';

/**------------------------------------------------------------------------
 **                           AdminDashboard
 *?  Renders side bar of admin dashboard and main viewing area
 *------------------------------------------------------------------------**/

function AdminDashboard() {
  const navigate = useNavigate(); //navigator
  const [resource, setResource] = useState(''); //keep state of current resource being displayed
  const {state } = useLocation();
  
  const resourceCallback = (resource) => {
    setResource(resource);
  }

  useEffect(() => {
    if(!state){ //redirect to login if no state meaning no admin user object
      navigate("/");
    }
    setResource(state? state.resource : 'approval'); //used to set default viewing resource to approvals page
  }, [])

  return (
    <div className = 'md:flex-row md:flex '>
      <div className = "md:w-1/5">
        <SideBar resourceCallback = { resourceCallback } selected = {state? state.resource : 'approval'}/> 
      </div>
      <div className = "md:w-4/5 h-screen p-3 overscroll-contain overflow-auto">
        <div className='bg-gray-100 rounded h-fit shadow-xl'>
          {resource == 'students' && <Students />}
          {resource == 'teachers' && <Teachers />}
          {resource == 'schools' && <Schools />}
          {resource == 'admins' && <Admins />}
          {resource == 'subjects' && <Subjects />}
          {resource == 'supervisors' && <Supervisors />}
          {resource == 'areas' && <Areas />}
          {resource == 'groups' && <Groups />}
          {resource == 'rooms' && <Rooms />}
          {resource == 'degrees' && <Degrees />}
          {resource == 'approval' && <AccountsApproval />}
          {resource == 'engagement' && <Engagement />}
          {resource == 'distractors' && <Distractors />}
          {resource == 'attention' && <Attention />}
          {resource == 'interaction' && <Interaction />}
          {resource == 'events' && <Events />}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard;