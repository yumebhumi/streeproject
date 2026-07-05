import LoginForm from "@/components/auth/LoginForm";

export default function Login() {
  return (
    <div className="flex flex-col lg:flex-row h-full lg:h-screen bg-gray-900">
      <div className="w-full lg:w-1/2 flex items-center justify-center relative overflow-hidden lg:ml-20">
        <img
          src="/welcomebackk.png"
          alt="Welcome Again"
          className="w-full h-auto object-cover"
          style={{ imageRendering: "crisp-edges" }}
        />
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <LoginForm />
      </div>
    </div>
  );
}
