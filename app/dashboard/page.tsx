import { getAllUsers } from "@/_actions/userAction.js";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import DialogUser from "@/components/dialog-user";

async function fetchData() {
  return await getAllUsers();
}

export default async function Page() {
  const data = await fetchData();
  console.log(data);
  // <pre>{JSON.stringify(data, null, 2)}</pre>

  return (
    <>
      <DialogUser />
      <DataTable columns={columns} data={data.users} />
    </>
  );
}
