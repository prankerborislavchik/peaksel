import { EditTelevisionPage } from "@/features/Admin";

export default function Page({params: {id}}: {params: {id: string}}) {
    return <EditTelevisionPage id={id} className='container center'/>
}