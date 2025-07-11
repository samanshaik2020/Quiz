import SignUpForm from "@/components/auth/SignUpForm";

export default function AdminSignUp() {
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Quiz Admin Portal</h1>
        <SignUpForm />
      </div>
    </div>
  );
}
