import { TelevisionPage } from "@/widgets/TelevisionPage";

export default function Page({params: {televisionId}}: {params: {televisionId: string}}) {
    return <TelevisionPage televisionId={televisionId} className="container"/>
}