import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Mail, Lock, User, Zap } from "lucide-react";
import assets from "../../assets/assets";
import {
  useRegisterUserMutation,
  useLoginUserMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "../../features/api/authApi";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonLoader from "../../components/Loader/ButtonLoader";
import { toast } from "react-hot-toast";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("google") === "error") {
      const message = params.get("message")
        ? decodeURIComponent(params.get("message"))
        : "Google login failed";
      toast.error(message);
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [registerUser, { isLoading: isRegistering }] =
    useRegisterUserMutation();
  const [loginUser, { isLoading: isLogging }] = useLoginUserMutation();
  const [verifyOtpMutation, { isLoading: isVerifying }] =
    useVerifyOtpMutation();
  const [resendOtpMutation, { isLoading: isResending }] =
    useResendOtpMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      agreeToTerms: false,
      rememberMe: false,
      otp: "",
    },
  });

  const password = watch("password");
  const email = watch("email");

  const isAnyLoading =
    isLogging || isRegistering || isVerifying || isGoogleLoading;

  const onSubmit = async (data) => {
    if (otpMode) {
      try {
        await verifyOtpMutation({
          email: data.email,
          otp: data.otp,
        }).unwrap();
        toast.success("Email verified successfully!");
        reset();
        setOtpMode(false);
        navigate("/");
      } catch (err) {
        console.log(err);

        toast.error(
          err.data?.message || "Verification failed. Please try again."
        );
      }
    } else if (isLogin) {
      try {
        await loginUser({
          email: data.email,
          password: data.password,
        }).unwrap();
        toast.success("Logged in successfully!");
        reset();
        navigate("/");
      } catch (err) {
        if (
          err.status === 403 &&
          err.data?.message === "Please verify your email before logging in"
        ) {
          setOtpMode(true);
          toast.success("Please enter the OTP sent to your email to verify.");
        } else {
          toast.error(err.data?.message || "Login failed. Please try again.");
        }
      }
    } else {
      if (!data.agreeToTerms) {
        toast.error("Please agree to the Terms of Service");
        return;
      }
      try {
        await registerUser({
          username: data.username,
          email: data.email,
          password: data.password,
        }).unwrap();
        setOtpMode(true);
        toast.success(
          "Registration successful. Please enter the OTP sent to your email."
        );
        reset({ email: data.email, otp: "" });
      } catch (err) {
        toast.error(
          err.data?.message || "Registration failed. Please try again."
        );
      }
    }
  };

  const handleGoogle = () => {
    setIsGoogleLoading(true);
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/api/v1/user/auth/google`;
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email is required to resend OTP");
      return;
    }
    try {
      await resendOtpMutation({ email }).unwrap();
      toast.success("OTP resent successfully. Check your email.");
    } catch (err) {
      toast.error(
        err.data?.message || "Failed to resend OTP. Please try again."
      );
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setOtpMode(false);
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center justify-center p-4 relative overflow-hidden pt-[5.8rem] pb-10">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-gray-900/20 to-yellow-500/20"></div>

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{
          backgroundImage: `url(${assets.freefire})`,
        }}
      ></div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="absolute top-20 left-20 text-orange-500 opacity-30 animate-bounce">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
        </svg>
      </div>
      <div className="absolute top-40 right-32 text-red-500 opacity-30 animate-bounce animation-delay-1000">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.5 2C13.3 2 14 2.7 14 3.5C14 4.3 13.3 5 12.5 5C11.7 5 11 4.3 11 3.5C11 2.7 11.7 2 12.5 2M21 9V7H15L13.5 7.5C13.1 7.7 12.7 8 12.6 8.5L11.5 13C11.3 13.6 11.8 14 12.5 14H13.5C14 14 14.5 13.6 14.8 13.2L16.3 10.7L18.3 12C18.7 12.3 19.6 12 19.5 11.2L19.1 9.5C19.1 9.2 18.9 9 18.6 9H21M7 9C8.1 9 9 9.9 9 11V17H7.5V13H6.5V17H5V11C5 9.9 5.9 9 7 9Z" />
        </svg>
      </div>
      <div className="absolute bottom-32 left-32 text-yellow-500 opacity-30 animate-bounce animation-delay-2000">
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.5,2.5L18.5,7.36L23,8.5L18.5,9.64L17.5,14.5L16.5,9.64L12,8.5L16.5,7.36L17.5,2.5M12.5,2C13.3,2 14,2.7 14,3.5C14,4.3 13.3,5 12.5,5C11.7,5 11,4.3 11,3.5C11,2.7 11.7,2 12.5,2M9.5,21.5C8.7,21.5 8,20.8 8,20C8,19.2 8.7,18.5 9.5,18.5C10.3,18.5 11,19.2 11,20C11,20.8 10.3,21.5 9.5,21.5Z" />
        </svg>
      </div>
      <div className="absolute top-1/3 right-20 text-orange-500 opacity-20 animate-pulse">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
        </svg>
      </div>

      <div className="text-center">
        <div className="inline-flex items-center space-x-2 mb-4">
          <div className="w-[8rem] h-[8rem] rounded-xl flex items-center justify-center shadow-2xl">
            <img src={assets.logo} alt="logo" className="h-full w-full" />
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-0">
        <div className="w-full lg:w-1/2 relative order-2 lg:order-1">
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl">
              <img
                src={assets.freefire}
                alt="Free Fire Tournament"
                className="w-full h-[400px] lg:h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/30 via-transparent to-red-500/30"></div>

              <div className="absolute bottom-8 left-8 text-white">
                <h2 className="text-2xl lg:text-4xl font-bold mb-2 drop-shadow-lg">
                  Epic Battles
                </h2>
                <p className="text-lg opacity-90 drop-shadow-lg">
                  Join the ultimate Free Fire tournament experience
                </p>
                <div className="mt-4 flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-sm lg:text-2xl font-bold text-orange-400">
                      50K+
                    </div>
                    <div className="text-sm opacity-80">Players</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm lg:text-2xl font-bold text-red-400">
                      ₹10L+
                    </div>
                    <div className="text-sm opacity-80">Prize Pool</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm lg:text-2xl font-bold text-yellow-400">
                      24/7
                    </div>
                    <div className="text-sm opacity-80">Tournaments</div>
                  </div>
                </div>
              </div>

              <div className="absolute top-8 left-8">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                  🔥 FREE FIRE TOURNAMENT
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 h-10 w-10 lg:w-16 lg:h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <svg
                className="lg:w-8 lg:h-8 h-5 w-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
              </svg>
            </div>

            <div className="absolute -bottom-5 -left-0 lg:-left-10 h-10 w-10 lg:w-16 lg:h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
              <svg
                className="lg:w-8 lg:h-8 w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M5,16L3,5H1V3H4L6,14H18.5C19.5,14 20.2,14.4 20.6,15.1L16.9,18.8C16.5,19.2 16,19.4 15.5,19.4H6.5C5.4,19.4 4.5,18.5 4.5,17.4C4.5,16.3 5.4,15.4 6.5,15.4H15L17.5,13H6.5L5,16M6.5,20.5A1.5,1.5 0 0,1 8,22A1.5,1.5 0 0,1 6.5,23.5A1.5,1.5 0 0,1 5,22A1.5,1.5 0 0,1 6.5,20.5M17.5,20.5A1.5,1.5 0 0,1 19,22A1.5,1.5 0 0,1 17.5,23.5A1.5,1.5 0 0,1 16,22A1.5,1.5 0 0,1 17.5,20.5Z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 lg:pl-12 order-1 lg:order-2">
          <div className="max-w-5xl mx-auto">
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl w-full">
              <div className="flex bg-gray-800/50 rounded-xl p-1 mb-6">
                <button
                  onClick={() => setIsLogin(true)}
                  disabled={isAnyLoading || otpMode}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isLogin && !otpMode
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                      : "text-gray-400 hover:text-white"
                  } ${
                    isAnyLoading || otpMode
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <span>🎮 Login</span>
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  disabled={isAnyLoading || otpMode}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                    !isLogin && !otpMode
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                      : "text-gray-400 hover:text-white"
                  } ${
                    isAnyLoading || otpMode
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <span>🔥 Sign Up</span>
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {otpMode ? (
                  // OTP Verification Form
                  <>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email address",
                          },
                        })}
                        placeholder="Email address"
                        className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 ${
                          isAnyLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isAnyLoading}
                      />
                      {errors.email && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Zap className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register("otp", {
                          required: "OTP is required",
                          pattern: {
                            value: /^\d{6}$/,
                            message: "OTP must be a 6-digit number",
                          },
                        })}
                        placeholder="Enter OTP"
                        className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 ${
                          isAnyLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isAnyLoading}
                      />
                      {errors.otp && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.otp.message}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  // Login/Signup Form
                  <>
                    {!isLogin && (
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          {...register("username", {
                            required: "Username is required",
                            minLength: {
                              value: 3,
                              message: "Username must be at least 3 characters",
                            },
                            maxLength: {
                              value: 10,
                              message: "Username cannot exceed 10 characters",
                            },
                          })}
                          placeholder="Username"
                          className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 ${
                            isAnyLoading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          disabled={isAnyLoading}
                        />
                        {errors.username && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.username.message}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email address",
                          },
                        })}
                        placeholder="Email address"
                        className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 ${
                          isAnyLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isAnyLoading}
                      />
                      {errors.email && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                        placeholder="Password"
                        className={`w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 ${
                          isAnyLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isAnyLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-orange-400 transition-colors ${
                          isAnyLoading
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        disabled={isAnyLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                      {errors.password && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    {!isLogin && (
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          {...register("confirmPassword", {
                            required: "Confirm password is required",
                            validate: (value) =>
                              value === password || "Passwords do not match",
                          })}
                          placeholder="Confirm password"
                          className={`w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 ${
                            isAnyLoading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          disabled={isAnyLoading}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className={`absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-orange-400 transition-colors ${
                            isAnyLoading
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                          disabled={isAnyLoading}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                        {errors.confirmPassword && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.confirmPassword.message}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      {isLogin ? (
                        <label className="flex items-center text-gray-300">
                          <input
                            type="checkbox"
                            {...register("rememberMe")}
                            className={`mr-2 w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2 ${
                              isAnyLoading
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={isAnyLoading}
                          />
                          Remember me
                        </label>
                      ) : (
                        <label className="flex items-center text-gray-300 text-xs">
                          <input
                            type="checkbox"
                            {...register("agreeToTerms", {
                              required:
                                "You must agree to the Terms of Service",
                            })}
                            className={`mr-2 w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2 ${
                              isAnyLoading
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={isAnyLoading}
                          />
                          I agree to the Terms of Service (Age 16+)
                        </label>
                      )}
                      {errors.agreeToTerms && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.agreeToTerms.message}
                        </p>
                      )}

                      {isLogin && (
                        <a
                          href="#"
                          className={`text-orange-400 hover:text-orange-300 transition-colors ${
                            isAnyLoading
                              ? "opacity-50 cursor-not-allowed pointer-events-none"
                              : ""
                          }`}
                        >
                          Forgot password?
                        </a>
                      )}
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={isAnyLoading}
                  className={`w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                    isAnyLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>
                      {otpMode
                        ? isVerifying
                          ? "Verifying..."
                          : "Verify OTP"
                        : isLogin
                        ? isLogging
                          ? "Logging in..."
                          : "🎮 Start Playing"
                        : isRegistering
                        ? "Registering..."
                        : "🔥 Join Tournament"}
                    </span>
                    {(isVerifying || isLogging || isRegistering) && (
                      <ButtonLoader />
                    )}
                  </div>
                </button>

                {otpMode && (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending || !email || isAnyLoading}
                    className={`w-full py-3 px-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-gray-500/25 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                      isResending || !email || isAnyLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span>{isResending ? "Resending..." : "Resend OTP"}</span>
                      {isResending && <ButtonLoader />}
                    </div>
                  </button>
                )}
              </form>

              {!otpMode && (
                <>
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-gray-800/50 px-2 text-gray-400">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid">
                      <button
                        onClick={handleGoogle}
                        disabled={isAnyLoading}
                        className={`flex items-center justify-center px-4 py-2 border border-gray-700 rounded-lg bg-gray-800/30 text-white hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                          isAnyLoading
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <img
                            src={assets.google}
                            alt="Google logo"
                            className="w-5 h-5"
                          />
                          <span>
                            {isGoogleLoading ? "Connecting..." : "Google"}
                          </span>
                          {isGoogleLoading && <ButtonLoader />}
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 text-center text-sm text-gray-400">
                    {isLogin
                      ? "Don't have an account? "
                      : "Already have an account? "}
                    <button
                      onClick={toggleMode}
                      disabled={isAnyLoading}
                      className={`text-orange-400 hover:text-orange-300 font-medium transition-colors ${
                        isAnyLoading
                          ? "opacity-50 cursor-not-allowed pointer-events-none"
                          : "cursor-pointer"
                      }`}
                    >
                      {isLogin ? "Sign up for tournament" : "Log in here"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
