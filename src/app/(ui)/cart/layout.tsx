import { ProtectedRoute } from "@/features/ProtectedRoute";
import { ReactNode } from "react";


export default function Layout({children}: {children: ReactNode}) {
    // Корзиной может пользоваться только авторизованный пользователь
    return (
        <ProtectedRoute roles={"USER"}>
            {children}
        </ProtectedRoute>
    )

}