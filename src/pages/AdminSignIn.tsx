import SignInForm from "@/components/auth/SignInForm";

export default function AdminSignIn() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Quiz Admin Portal</h1>
        <SignInForm />
      </div>
    </div>
  );
}
