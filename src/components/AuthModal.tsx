import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
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
import ForgotPasswordModal from "@/components/ForgotPasswordModal";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    });
    setError("");
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match.");
          setLoading(false);
          return;
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        const userId = session?.user?.id || signUpData.user?.id;

        if (!userId) {
          setError("User ID not available. Can't create profile.");
          setLoading(false);
          return;
        }

        const { error: upsertError } = await supabase
          .from("users")
          .upsert(
            [
              {
                id: userId,
                email: formData.email,
                first_name: formData.firstName,
                last_name: formData.lastName,
                created_at: new Date().toISOString(),
              },
            ],
            { onConflict: "id" }
          );

        if (upsertError) {
          console.error("Upsert Error:", upsertError.message);
          setError("Failed to save profile.");
          setLoading(false);
          return;
        }

        onClose();
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) {
          setError(signInError.message);
          setLoading(false);
          return;
        }

        onClose();
      }
    } catch (err) {
      console.error("Auth Error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  const handleForgotPasswordClose = () => {
    setShowForgotPassword(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-[#161616]">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </DialogTitle>
            <DialogDescription className="text-center text-[#B2AFAB]">
              {isSignUp
                ? "Join DearNeuro for exclusive benefits and personalized wellness"
                : "Sign in to your DearNeuro account"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Google Sign-In Button */}
            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full border-2 border-gray-200 hover:bg-gray-50 rounded-xl py-3 h-auto"
            >
              <div className="flex items-center gap-3">
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  width="20"
                  height="20"
                />
                <span className="text-sm font-medium text-gray-700">
                  Continue with Google
                </span>
              </div>
            </Button>

            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex justify-center items-center">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-xs text-[#514B3D] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
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
          </div>
        </DialogContent>
      </Dialog>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={handleForgotPasswordClose}
      />
    </>
  );
};

export default AuthModal;