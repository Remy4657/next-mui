import { cookies } from "next/headers";

const cookieStore = await cookies();
const Dashboard = () => {
  if (cookieStore.get("refreshToken")) {
    var cookie = cookieStore.get("refreshToken")?.value as string;
    console.log("refreshToken: ", cookie);
  }
  return <div>Dashboard</div>;
};
export default Dashboard;
