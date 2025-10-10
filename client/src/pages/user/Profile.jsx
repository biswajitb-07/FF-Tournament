import { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Trophy,
  Edit2,
  Camera,
  Shield,
  Star,
  Gamepad2,
  Save,
  X,
  Zap,
  Target,
  Award,
  Clock,
  Settings,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  useLoadUserQuery,
  useUpdateProfileMutation,
  useLogoutUserMutation,
  useSendPasswordOtpMutation,
  useSetPasswordMutation,
} from "../../features/api/authApi";
import { toast } from "react-hot-toast";
import ButtonLoader from "../../components/Loader/ButtonLoader";
import { Navigate, useNavigate } from "react-router-dom";
import TeamManagement from "../../components/TeamManagement";
import LoadingSpinner from "../../components/Loader/LoadingSpinner";
import { useSelector } from "react-redux";

const ProfileField = ({
  icon: Icon,
  label,
  value,
  editable = false,
  type = "text",
  fieldName,
  isEditing,
  isSaving,
  handleInputChange,
}) => (
  <div className="group relative bg-gray-800/50 rounded-lg p-4 hover:bg-gray-700/50 transition-all duration-300 border border-gray-600/50">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-orange-500/20 rounded-md group-hover:bg-orange-500/30 transition-colors">
        <Icon className="w-5 h-5 text-orange-400" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-300 font-medium">{label}</p>
        {isEditing && editable ? (
          <input
            type={type}
            value={value || ""}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            className={`w-full mt-1 px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400/50 transition-all ${
              isSaving ? "opacity-50 cursor-not-allowed" : ""
            }`}
            placeholder={`Enter ${label.toLowerCase()}`}
            disabled={isSaving}
          />
        ) : (
          <p className="text-white text-base font-semibold mt-1">
            {value || "Not provided"}
          </p>
        )}
      </div>
    </div>
  </div>
);

const StatCard = ({ icon: Icon, title, value, subtitle, gradient }) => (
  <div
    className={`relative overflow-hidden rounded-lg p-4 ${gradient} hover:shadow-orange-500/20 transition-all duration-300 shadow-md`}
  >
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-6 h-6 text-white/90" />
      </div>
      <h3 className="text-gray-200 text-sm font-medium">{title}</h3>
      <p className="text-white text-xl font-bold">{value ?? "N/A"}</p>
      <p className="text-gray-300 text-xs">{subtitle}</p>
    </div>
  </div>
);

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-white mb-4">
          Confirm Logout
        </h3>
        <p className="text-gray-300 mb-6">Are you sure you want to logout?</p>
        <div className="flex space-x-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-300 cursor-pointer"
          >
            Yes, Logout
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-all duration-300 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingGame, setIsEditingGame] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [passwordStep, setPasswordStep] = useState("input");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [originalUserData, setOriginalUserData] = useState(null);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { data, isLoading } = useLoadUserQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [logoutUser] = useLogoutUserMutation();
  const [sendPasswordOtp] = useSendPasswordOtpMutation();
  const [setPassword] = useSetPasswordMutation();

  const [userData, setUserData] = useState(null);

  const { isAuthenticated } = useSelector((store) => store.auth);
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (data?.user) {
      const user = {
        _id: data.user._id || "",
        username: data.user.username || "",
        email: data.user.email || "",
        gameDetails: {
          gameId: data.user.gameDetails?.gameId || 0,
          level: data.user.gameDetails?.level || 0,
          gameUsername: data.user.gameDetails?.gameUsername || "",
        },
        phoneNumber: data.user.phoneNumber || "",
        profilePicture: data.user.profilePicture || "",
        dateOfBirth: data.user.dateOfBirth || "",
        country: data.user.country || "",
        role: data.user.role || "",
        isVerified: data.user.isVerified || false,
        createdAt: data.user.createdAt || "",
        lastLoginAt: data.user.lastLoginAt || "",
        isGoogleUser: data.user.isGoogleUser || false,
        hasPassword: data.user.hasPassword || false,
        isBlocked: data.user.isBlocked || false,
      };
      setUserData(user);
      setOriginalUserData(user);
      setPreviewUrl(data.user.profilePicture || "");
    }
  }, [data]);

  const handleInputChange = (field, value) => {
    setUserData((prev) => {
      if (field.startsWith("gameDetails.")) {
        const gameField = field.split(".")[1];
        return {
          ...prev,
          gameDetails: {
            ...prev.gameDetails,
            [gameField]: value,
          },
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleSaveProfile = async () => {
    if (userData.username.length < 3 || userData.username.length > 30) {
      toast.error("Username must be 3-30 characters");
      return;
    }

    setIsSaving(true);
    const formData = new FormData();
    formData.append("username", userData.username);
    if (userData.phoneNumber)
      formData.append("phoneNumber", userData.phoneNumber);
    if (userData.dateOfBirth)
      formData.append("dateOfBirth", userData.dateOfBirth);
    if (userData.country) formData.append("country", userData.country);
    if (profilePictureFile) {
      if (profilePictureFile.size > 10 * 1024 * 1024) {
        toast.error("Profile picture must be less than 500kb");
        setIsSaving(false);
        return;
      }
      if (!profilePictureFile.type.startsWith("image/")) {
        toast.error("Only image files are allowed for profile picture");
        setIsSaving(false);
        return;
      }
      formData.append("photo", profilePictureFile);
    }

    try {
      const result = await updateProfile(formData).unwrap();
      setUserData((prev) => ({
        ...prev,
        ...result.user,
      }));
      setOriginalUserData((prev) => ({
        ...prev,
        ...result.user,
      }));
      setPreviewUrl(result.user.profilePicture || "");
      setProfilePictureFile(null);
      setIsEditingProfile(false);
      toast.success("Personal details updated successfully");
    } catch (error) {
      const message =
        error?.data?.message || "Failed to update personal details";
      if (message.includes("username_1 dup key")) {
        toast.error("Username is already taken");
      } else {
        toast.error(message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveGame = async () => {
    const level = parseInt(userData.gameDetails.level, 10);
    if (isNaN(level) || userData.gameDetails.level === "") {
      toast.error("Game level must be a valid number");
      return;
    }
    if (level < 50) {
      toast.error("Game level must be greater than or equal to 50");
      return;
    }

    setIsSaving(true);
    const formData = new FormData();
    if (userData.gameDetails.gameId) {
      formData.append("gameId", userData.gameDetails.gameId);
    }
    formData.append("level", userData.gameDetails.level);
    if (userData.gameDetails.gameUsername)
      formData.append("gameUsername", userData.gameDetails.gameUsername);

    try {
      const result = await updateProfile(formData).unwrap();
      setUserData((prev) => ({
        ...prev,
        gameDetails: {
          ...prev.gameDetails,
          ...result.user.gameDetails,
        },
      }));
      setOriginalUserData((prev) => ({
        ...prev,
        gameDetails: {
          ...prev.gameDetails,
          ...result.user.gameDetails,
        },
      }));
      setIsEditingGame(false);
      toast.success("Game details updated successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update game details");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setUserData(originalUserData);
    setPreviewUrl(originalUserData.profilePicture || "");
    setProfilePictureFile(null);
    setIsEditingProfile(false);
    setIsEditingGame(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser().unwrap();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to logout");
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";
  };

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    console.log(newPassword.length);

    if (newPassword.length <= 5) {
      toast.error("Password must be at least 6 charcters");
      return;
    }
    setIsSendingOtp(true);
    try {
      await sendPasswordOtp().unwrap();
      setPasswordStep("otp");
      toast.success("OTP sent to your email");
    } catch (err) {
      const errorMessage = err?.data?.message || "Failed to send OTP";
      if (errorMessage.includes("TempUser validation failed")) {
        toast.error("Invalid OTP request. Please try again later.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const otpverify = async () => {
    setIsVerifyingOtp(true);
    try {
      await setPassword({ otp, newPassword }).unwrap();
      setShowPasswordModal(false);
      setPasswordStep("input");
      setNewPassword("");
      setConfirmPassword("");
      setOtp("");
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      toast.success("Password updated successfully", {
        style: {
          background: "#10b981",
          color: "#fff",
        },
      });
      setUserData((prev) => ({ ...prev, hasPassword: true }));
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update password");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  if (isLoading || !userData) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (userData.isBlocked) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Account Blocked</h1>
          <p>Your account has been blocked. Please contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-[2rem] lg:pt-[5rem] pb-20">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between py-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500/10 rounded-lg backdrop-blur-sm">
              <Zap className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Gamer Profile
              </h1>
              <p className="text-gray-300 text-sm">Manage Your Account</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 mb-6 border border-gray-700/30">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative group">
              <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-md hover:shadow-orange-500/30 transition-all duration-300">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile"
                    className="w-full h-full rounded-lg object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-white" />
                )}
              </div>
              {isEditingProfile && (
                <button
                  onClick={() => fileInputRef.current.click()}
                  disabled={isSaving}
                  className={`absolute -bottom-2 -right-2 p-2 bg-orange-500 rounded-full hover:bg-orange-600 transition-all duration-300 shadow-md cursor-pointer ${
                    isSaving ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    if (file.size > 10 * 1024 * 1024) {
                      toast.error("Profile picture must be less than 500kB");
                      return;
                    }
                    if (!file.type.startsWith("image/")) {
                      toast.error("Only image files are allowed");
                      return;
                    }
                    setPreviewUrl(URL.createObjectURL(file));
                    setProfilePictureFile(file);
                  }
                }}
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2 mb-3">
                <h2 className="text-2xl font-bold text-white">
                  {userData.username}
                </h2>
                {userData.isVerified && (
                  <Shield
                    className="w-5 h-5 text-green-400"
                    title="Verified User"
                  />
                )}
              </div>
              <p className="text-gray-300 text-sm mb-3">{userData.email}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-gray-300">
                <div className="flex items-center space-x-2 bg-gray-700/50 px-3 py-1 rounded-md">
                  <Star className="w-4 h-4 text-orange-400" />
                  <span className="capitalize text-sm">{userData.role}</span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-700/50 px-3 py-1 rounded-md">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span className="text-sm">
                    Joined {formatDate(userData.createdAt)}
                  </span>
                </div>
                {userData.lastLoginAt && (
                  <div className="flex items-center space-x-2 bg-gray-700/50 px-3 py-1 rounded-md">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <span className="text-sm">
                      Last Login {formatDate(userData.lastLoginAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:w-64">
              <StatCard
                icon={Target}
                title="Game Level"
                value={userData.gameDetails.level}
                gradient="bg-gradient-to-br from-blue-500 to-blue-600"
              />
              <StatCard
                icon={Award}
                title="Game ID"
                value={userData.gameDetails.gameId}
                gradient="bg-gradient-to-br from-purple-500 to-purple-600"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 p-2 bg-gray-800/50 backdrop-blur-md rounded-lg border border-gray-700/30">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "game", label: "Game Details", icon: Gamepad2 },
            { id: "teams", label: "Teams & Tournaments", icon: Trophy },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              disabled={isSaving || isLoggingOut}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-300 flex-1 justify-center min-w-fit text-sm font-medium cursor-pointer ${
                activeTab === tab.id
                  ? "bg-orange-500 text-white shadow-md"
                  : "text-gray-300 hover:text-white hover:bg-gray-700/50"
              } ${
                isSaving || isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeTab === "profile" && (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                    <User className="w-5 h-5 text-orange-400" />
                    <span>Personal Information</span>
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        isEditingProfile
                          ? handleSaveProfile()
                          : setIsEditingProfile(true)
                      }
                      disabled={isSaving || isLoggingOut}
                      className={`flex items-center space-x-2 px-4 py-2 bg-orange-500 rounded-lg text-white font-medium hover:bg-orange-600 transition-all duration-300 cursor-pointer ${
                        isSaving || isLoggingOut
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {isSaving ? (
                        <ButtonLoader />
                      ) : isEditingProfile ? (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save</span>
                        </>
                      ) : (
                        <>
                          <Edit2 className="w-4 h-4" />
                          <span>Edit Profile</span>
                        </>
                      )}
                    </button>
                    {isEditingProfile && (
                      <button
                        onClick={handleCancel}
                        disabled={isSaving || isLoggingOut}
                        className={`flex items-center space-x-2 px-4 py-2 bg-red-500 rounded-lg text-white font-medium hover:bg-red-600 transition-all duration-300 cursor-pointer ${
                          isSaving || isLoggingOut
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
                <ProfileField
                  icon={User}
                  label="Username"
                  value={userData.username}
                  editable
                  fieldName="username"
                  isEditing={isEditingProfile}
                  isSaving={isSaving}
                  handleInputChange={handleInputChange}
                />
                <ProfileField
                  icon={Mail}
                  label="Email"
                  value={userData.email}
                  type="email"
                  fieldName="email"
                  isEditing={isEditingProfile}
                  isSaving={isSaving}
                  handleInputChange={handleInputChange}
                />
                <ProfileField
                  icon={Phone}
                  label="Phone Number"
                  value={userData.phoneNumber}
                  editable
                  type="tel"
                  fieldName="phoneNumber"
                  isEditing={isEditingProfile}
                  isSaving={isSaving}
                  handleInputChange={handleInputChange}
                />
                <ProfileField
                  icon={Calendar}
                  label="Date of Birth"
                  value={userData.dateOfBirth}
                  editable
                  type="date"
                  fieldName="dateOfBirth"
                  isEditing={isEditingProfile}
                  isSaving={isSaving}
                  handleInputChange={handleInputChange}
                />
                <ProfileField
                  icon={MapPin}
                  label="Country"
                  value={userData.country}
                  editable
                  fieldName="country"
                  isEditing={isEditingProfile}
                  isSaving={isSaving}
                  handleInputChange={handleInputChange}
                />
              </div>
              <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700/30">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-orange-400" />
                  <span>Account Settings</span>
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-md border border-gray-600/50">
                    <span className="text-gray-300 text-sm">
                      Account Status
                    </span>
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        userData.isVerified
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {userData.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-md border border-gray-600/50">
                    <span className="text-gray-300 text-sm">User Role</span>
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-md text-xs font-medium capitalize">
                      {userData.role}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-md border border-gray-600/50">
                    <span className="text-gray-300 text-sm">Password</span>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      disabled={isSaving || isLoggingOut}
                      className={`px-2 py-1 bg-orange-500 text-white rounded-md text-xs font-medium hover:bg-orange-600 transition-all duration-300 cursor-pointer ${
                        isSaving || isLoggingOut
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {userData.hasPassword
                        ? "Change Password"
                        : "Set Password"}
                    </button>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-md border border-gray-600/50">
                    <span className="text-gray-300 text-sm">Logout</span>
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      disabled={isSaving || isLoggingOut}
                      className={`px-2 py-1 bg-red-500 text-white rounded-md text-xs font-medium hover:bg-red-600 transition-all duration-300 cursor-pointer ${
                        isSaving || isLoggingOut
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "game" && (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                    <Gamepad2 className="w-5 h-5 text-orange-400" />
                    <span>Gaming Information</span>
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        isEditingGame
                          ? handleSaveGame()
                          : setIsEditingGame(true)
                      }
                      disabled={isSaving || isLoggingOut}
                      className={`flex items-center space-x-2 px-4 py-2 bg-orange-500 rounded-lg text-white font-medium hover:bg-orange-600 transition-all duration-300 cursor-pointer ${
                        isSaving || isLoggingOut
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {isSaving ? (
                        <ButtonLoader />
                      ) : isEditingGame ? (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save</span>
                        </>
                      ) : (
                        <>
                          <Edit2 className="w-4 h-4" />
                          <span>Edit Game Info</span>
                        </>
                      )}
                    </button>
                    {isEditingGame && (
                      <button
                        onClick={handleCancel}
                        disabled={isSaving || isLoggingOut}
                        className={`flex items-center space-x-2 px-4 py-2 bg-red-500 rounded-lg text-white font-medium hover:bg-red-600 transition-all duration-300 cursor-pointer ${
                          isSaving || isLoggingOut
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
                <ProfileField
                  icon={Target}
                  label="Game ID"
                  value={userData.gameDetails.gameId}
                  editable
                  fieldName="gameDetails.gameId"
                  isEditing={isEditingGame}
                  isSaving={isSaving}
                  handleInputChange={handleInputChange}
                />
                <ProfileField
                  icon={Star}
                  label="Level"
                  value={userData.gameDetails.level}
                  editable
                  type="number"
                  fieldName="gameDetails.level"
                  isEditing={isEditingGame}
                  isSaving={isSaving}
                  handleInputChange={handleInputChange}
                />
                <ProfileField
                  icon={User}
                  label="Game Username"
                  value={userData.gameDetails.gameUsername}
                  editable
                  fieldName="gameDetails.gameUsername"
                  isEditing={isEditingGame}
                  isSaving={isSaving}
                  handleInputChange={handleInputChange}
                />
              </div>
              <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-gray-700/30">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-orange-400" />
                  <span>Game Statistics</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <Star className="w-5 h-5 text-white/90" />
                      <span className="text-lg font-bold text-white">
                        {userData.gameDetails.level ?? "N/A"}
                      </span>
                    </div>
                    <p className="text-gray-200 text-xs">Current Level</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <Shield className="w-5 h-5 text-white/90" />
                      <span className="text-sm font-bold text-white">
                        {userData.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                    <p className="text-gray-200 text-xs">Account Status</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "teams" && (
            <div className="col-span-full">
              {isLoading ? (
                <div className="text-white text-center">Loading teams...</div>
              ) : (
                <TeamManagement userId={userData._id} />
              )}
            </div>
          )}
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">
              {userData.hasPassword ? "Change Password" : "Set Password"}
            </h3>
            {passwordStep === "input" ? (
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-md text-white pr-10"
                    disabled={isSendingOtp}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 cursor-pointer"
                    disabled={isSendingOtp}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-md text-white pr-10"
                    disabled={isSendingOtp}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 cursor-pointer"
                    disabled={isSendingOtp}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <button
                  onClick={changePassword}
                  disabled={isSendingOtp}
                  className={`w-full py-2 bg-orange-500 text-white rounded-md flex items-center justify-center hover:bg-orange-600 transition-all duration-300 cursor-pointer ${
                    isSendingOtp ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSendingOtp ? <ButtonLoader /> : "Send OTP"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-md text-white"
                    disabled={isVerifyingOtp}
                  />
                </div>
                <button
                  onClick={otpverify}
                  disabled={isVerifyingOtp}
                  className={`w-full py-2 bg-orange-500 text-white rounded-md flex items-center justify-center hover:bg-orange-600 transition-all duration-300 cursor-pointer ${
                    isVerifyingOtp ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isVerifyingOtp ? <ButtonLoader /> : "Verify and Update"}
                </button>
              </div>
            )}
            <button
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordStep("input");
                setNewPassword("");
                setConfirmPassword("");
                setOtp("");
                setShowNewPassword(false);
                setShowConfirmPassword(false);
              }}
              className="w-full py-2 bg-gray-700 text-white rounded-md mt-2 hover:bg-gray-600 transition-all duration-300 cursor-pointer"
              disabled={isSendingOtp || isVerifyingOtp}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default Profile;
