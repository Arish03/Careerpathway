import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Forgot Password' };

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md card text-center">
        <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
        <p className="text-slate-400 text-sm mb-6">Enter your email and we'll send you a reset link.</p>
        <input type="email" placeholder="your@email.com" className="input-field mb-4" />
        <button className="btn-primary w-full">Send Reset Link</button>
      </div>
    </div>
  );
}
