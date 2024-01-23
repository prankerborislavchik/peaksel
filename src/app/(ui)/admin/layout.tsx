import { ProtectedRoute } from "@/features/ProtectedRoute";
import { ReactNode } from "react";

export default function Layout({children}: {children: ReactNode}) {

    return (
        <ProtectedRoute roles={['USER', 'ADMIN']}>
            {children}
        </ProtectedRoute>
    )
}