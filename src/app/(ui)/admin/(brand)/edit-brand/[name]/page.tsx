import { EditBrandForm } from "@/features/Admin";

export default function Page({params: {name}}: {params: {name: string}}) {
    return <EditBrandForm name={name} className="container center"/>
}