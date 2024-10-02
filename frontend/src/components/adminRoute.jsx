import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AdminRoute = () => {
    const { userInfo } = useSelector((state) => state.auth);
    return (userInfo && userInfo.userType === 'ROLE_ADMIN') ? <Outlet /> : <>{toast.error('Please login as an admin to continue!')}<Navigate to='/' replace /></>;
};

export default AdminRoute;