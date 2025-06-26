import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    });
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match.");
          setLoading(false);
          return;
        }

        const { data: signUpData, error: signUpError } =
          await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
          });

        if (signUpError) {
          alert(signUpError.message);
          setLoading(false);
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        const userId = session?.user?.id || signUpData.user?.id;

        if (!userId) {
          alert("User ID not available. Can't insert profile.");
          setLoading(false);
          return;
        }

        const { error: upsertError } = await supabase
          .from("users")
          .upsert(
            [
              {
                id: userId,
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                created_at: new Date().toISOString(),
              },
            ],
            { onConflict: "id" }
          );

        if (upsertError) {
          console.error("Upsert Error:", upsertError.message);
          alert("Failed to save profile.");
        }

        onClose();
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) {
          alert(signInError.message);
          setLoading(false);
          return;
        }

        onClose();
      }
    } catch (err) {
      console.error("Auth Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) alert(error.message);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      alert(error.message);
    } else {
      setResetSent(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#161616] text-center">
            {showReset
              ? "Reset Password"
              : isSignUp
              ? "Create Account"
              : "Welcome Back"}
          </DialogTitle>
          <DialogDescription className="text-center text-[#B2AFAB]">
            {showReset
              ? "We'll send a reset link to your email."
              : isSignUp
              ? "Join DearNeuro for exclusive benefits and personalized wellness"
              : "Sign in to your DearNeuro account"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {showReset ? (
            <>
              {resetSent ? (
                <p className="text-center text-green-600 text-sm">
                  Reset link sent to your email.
                </p>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="resetEmail">Email</Label>
                    <Input
                      id="resetEmail"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#514B3D] text-white"
                  >
                    Send Reset Link
                  </Button>
                </form>
              )}
              <div className="text-center">
                <button
                  onClick={() => setShowReset(false)}
                  className="text-sm text-[#514B3D] hover:underline"
                >
                  Back to login
                </button>
              </div>
            </>
          ) : (
            <>
              <Button
                onClick={handleGoogleSignIn}
                variant="outline"
                className="w-full border-2 border-gray-200 hover:bg-gray-50 rounded-xl py-3 h-auto"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">
                    Continue with Google
                  </span>
                </div>
              </Button>

              <div className="relative">
                <Separator />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white px-3 text-xs text-[#B2AFAB]">
                    or continue with email
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}

                {!isSignUp && (
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-sm text-[#514B3D] hover:underline"
                      onClick={() => {
                        resetForm();
                        setShowReset(true);
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#514B3D] hover:bg-[#5a5147] text-white rounded-xl py-3 h-auto"
                >
                  {loading
                    ? isSignUp
                      ? "Creating..."
                      : "Signing in..."
                    : isSignUp
                    ? "Create Account"
                    : "Sign In"}
                </Button>
              </form>

              <div className="text-center">
                <span className="text-sm text-[#B2AFAB]">
                  {isSignUp
                    ? "Already have an account?"
                    : "Don't have an account?"}
                </span>
                <button
                  onClick={toggleMode}
                  className="ml-1 text-sm text-[#514B3D] hover:underline font-medium"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
