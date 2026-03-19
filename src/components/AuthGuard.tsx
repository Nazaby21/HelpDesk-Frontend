"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAppSelector((state) => state.token.accessToken);
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const isLoginPath = pathname.startsWith("/auth/sign-in");
    const isDashboardPath = pathname === "/";

    // If not authenticated or no user, redirect to login unless already on login page
    if ((!isAuthenticated || !user) && !isLoginPath) {
      router.push("/auth/sign-in");
    } else if (isAuthenticated && user) {
      const isRoleUser = user.role?.toUpperCase() === "USER";
      if (isLoginPath) {
        // If user is logged in and tries to access login page, redirect based on role
        router.push(isRoleUser ? "/user/tickets" : "/");
      } else if (isDashboardPath && isRoleUser) {
        // USER role cannot access dashboard root
        router.push("/user/tickets");
      } else {
        setIsReady(true);
      }
    } else {
      setIsReady(true);
    }
  }, [pathname, token, user, isAuthenticated, router]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
