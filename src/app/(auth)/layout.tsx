import { ReactNode } from "react";
import Image from "next/image";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="relative flex min-h-screen flex-col bg-dark-500 lg:flex-row">
      <section className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">{children}</div>
      </section>

      <section className="auth-illustration relative hidden flex-1 items-center justify-center overflow-hidden lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-500/40 via-transparent to-dark-500/80" />
        <div className="relative z-10 grid grid-cols-2 gap-4 p-10">
          {[
            "#1c1f40",
            "#fffdf6",
            "#f8e1dd",
            "#253040",
            "#08193e",
            "#c7a784",
          ].map((color, i) => (
            <div
              key={color}
              className="h-44 w-32 rotate-3 rounded-md shadow-2xl transition hover:rotate-0"
              style={{
                backgroundColor: color,
                transform: `rotate(${i % 2 === 0 ? -6 : 8}deg)`,
              }}
            >
              <div className="flex h-full items-end p-3">
                <Image
                  src="/icons/logo.svg"
                  alt="book"
                  width={28}
                  height={28}
                  className="opacity-70"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AuthLayout;
