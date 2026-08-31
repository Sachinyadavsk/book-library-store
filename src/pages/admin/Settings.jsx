
import React, { useEffect, useState } from "react";
import {
  FaCog,
  FaUser,
  FaBell,
  FaBook,
  FaLock,
  FaSave,
  FaUndo,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSyncAlt,
} from "react-icons/fa";

import settingsService from "../../services/settingsService";

const Settings = () => {
  const [activeTab, setActiveTab] =
    useState("general");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  // ============================================================
  // SETTINGS STATE
  // ============================================================

  const [settings, setSettings] = useState({
    // General
    libraryName: "",
    email: "",
    phone: "",
    address: "",

    // Library
    borrowingLimit: 5,
    borrowingDays: 14,
    finePerDay: 5,
    maxRenewals: 2,

    // Notifications
    emailNotifications: true,
    borrowNotifications: true,
    returnNotifications: true,
    overdueNotifications: true,
    reviewNotifications: true,

    // Security
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ============================================================
  // LOAD SETTINGS
  // ============================================================

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await settingsService.getSettings();

      const data =
        response?.settings ||
        response?.data?.settings ||
        response?.data ||
        response ||
        {};

      setSettings((prev) => ({
        ...prev,
        ...data,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      console.error(
        "Settings error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load settings."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // CHANGE FIELD
  // ============================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setMessage("");
    setError("");
  };

  // ============================================================
  // SAVE GENERAL / LIBRARY / NOTIFICATION SETTINGS
  // ============================================================

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const payload = {
        libraryName:
          settings.libraryName,

        email: settings.email,

        phone: settings.phone,

        address: settings.address,

        borrowingLimit:
          Number(
            settings.borrowingLimit
          ),

        borrowingDays:
          Number(
            settings.borrowingDays
          ),

        finePerDay:
          Number(
            settings.finePerDay
          ),

        maxRenewals:
          Number(
            settings.maxRenewals
          ),

        emailNotifications:
          settings.emailNotifications,

        borrowNotifications:
          settings.borrowNotifications,

        returnNotifications:
          settings.returnNotifications,

        overdueNotifications:
          settings.overdueNotifications,

        reviewNotifications:
          settings.reviewNotifications,
      };

      await settingsService.updateSettings(
        payload
      );

      setMessage(
        "Settings saved successfully."
      );
    } catch (err) {
      console.error(
        "Save settings error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save settings."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // CHANGE PASSWORD
  // ============================================================

  const handlePasswordChange = async () => {
    if (
      !settings.currentPassword ||
      !settings.newPassword ||
      !settings.confirmPassword
    ) {
      setError(
        "Please fill in all password fields."
      );
      return;
    }

    if (
      settings.newPassword !==
      settings.confirmPassword
    ) {
      setError(
        "New password and confirmation password do not match."
      );
      return;
    }

    if (settings.newPassword.length < 6) {
      setError(
        "New password must be at least 6 characters."
      );
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      await settingsService.changePassword({
        currentPassword:
          settings.currentPassword,

        newPassword:
          settings.newPassword,
      });

      setSettings((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      setMessage(
        "Password changed successfully."
      );
    } catch (err) {
      console.error(
        "Password change error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to change password."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // RESET
  // ============================================================

  const handleReset = () => {
    fetchSettings();
    setMessage("");
    setError("");
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="space-y-6">

        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">

          <div className="h-80 bg-gray-200 rounded-xl animate-pulse" />

          <div className="h-[500px] bg-gray-200 rounded-xl animate-pulse" />

        </div>

      </div>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="space-y-6">

      {/* ==================================================
                HEADER
            ================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <FaCog className="text-xl" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Settings
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage your library settings
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={fetchSettings}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          <FaSyncAlt />
          Refresh
        </button>

      </div>

      {/* ==================================================
                ALERTS
            ================================================== */}

      {message && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">

          <FaCheckCircle />

          <span>
            {message}
          </span>

        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">

          <FaExclamationTriangle />

          <span>
            {error}
          </span>

        </div>
      )}

      {/* ==================================================
                CONTENT
            ================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">

        {/* ==================================================
                    SIDEBAR
                ================================================== */}

        <div className="bg-white border rounded-xl shadow-sm p-3 h-fit">

          <SettingsTab
            active={
              activeTab === "general"
            }
            icon={<FaUser />}
            title="General"
            onClick={() =>
              setActiveTab(
                "general"
              )
            }
          />

          <SettingsTab
            active={
              activeTab === "library"
            }
            icon={<FaBook />}
            title="Library"
            onClick={() =>
              setActiveTab(
                "library"
              )
            }
          />

          <SettingsTab
            active={
              activeTab ===
              "notifications"
            }
            icon={<FaBell />}
            title="Notifications"
            onClick={() =>
              setActiveTab(
                "notifications"
              )
            }
          />

          <SettingsTab
            active={
              activeTab === "security"
            }
            icon={<FaLock />}
            title="Security"
            onClick={() =>
              setActiveTab(
                "security"
              )
            }
          />

        </div>

        {/* ==================================================
                    SETTINGS PANEL
                ================================================== */}

        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">

          {/* ==================================================
                        GENERAL
                    ================================================== */}

          {activeTab ===
            "general" && (
              <SettingsSection
                title="General Settings"
                description="Manage your library contact and basic information."
              >

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <InputField
                    label="Library Name"
                    name="libraryName"
                    value={
                      settings.libraryName
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter library name"
                  />

                  <InputField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={
                      settings.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="library@example.com"
                  />

                  <InputField
                    label="Phone Number"
                    name="phone"
                    value={
                      settings.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="+91 9876543210"
                  />

                  <InputField
                    label="Address"
                    name="address"
                    value={
                      settings.address
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Library address"
                  />

                </div>

                <SaveActions
                  saving={saving}
                  onSave={handleSave}
                  onReset={handleReset}
                />

              </SettingsSection>
            )}

          {/* ==================================================
                        LIBRARY
                    ================================================== */}

          {activeTab ===
            "library" && (
              <SettingsSection
                title="Library Settings"
                description="Configure borrowing rules and fine policies."
              >

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <NumberField
                    label="Borrowing Limit"
                    name="borrowingLimit"
                    value={
                      settings.borrowingLimit
                    }
                    onChange={
                      handleChange
                    }
                    min="1"
                  />

                  <NumberField
                    label="Borrowing Days"
                    name="borrowingDays"
                    value={
                      settings.borrowingDays
                    }
                    onChange={
                      handleChange
                    }
                    min="1"
                  />

                  <NumberField
                    label="Fine Per Day"
                    name="finePerDay"
                    value={
                      settings.finePerDay
                    }
                    onChange={
                      handleChange
                    }
                    min="0"
                  />

                  <NumberField
                    label="Maximum Renewals"
                    name="maxRenewals"
                    value={
                      settings.maxRenewals
                    }
                    onChange={
                      handleChange
                    }
                    min="0"
                  />

                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">

                  <div className="flex gap-3">

                    <FaBook className="text-blue-600 mt-1" />

                    <div>

                      <p className="font-medium text-blue-900">
                        Borrowing Policy
                      </p>

                      <p className="text-sm text-blue-700 mt-1">
                        Members can borrow up to{" "}
                        <strong>
                          {
                            settings.borrowingLimit
                          }
                        </strong>{" "}
                        books for{" "}
                        <strong>
                          {
                            settings.borrowingDays
                          }
                        </strong>{" "}
                        days.
                      </p>

                    </div>

                  </div>

                </div>

                <SaveActions
                  saving={saving}
                  onSave={handleSave}
                  onReset={handleReset}
                />

              </SettingsSection>
            )}

          {/* ==================================================
                        NOTIFICATIONS
                    ================================================== */}

          {activeTab ===
            "notifications" && (
              <SettingsSection
                title="Notification Settings"
                description="Choose which library notifications should be enabled."
              >

                <div className="space-y-2">

                  <ToggleField
                    name="emailNotifications"
                    checked={
                      settings.emailNotifications
                    }
                    onChange={
                      handleChange
                    }
                    title="Email Notifications"
                    description="Enable general email notifications."
                  />

                  <ToggleField
                    name="borrowNotifications"
                    checked={
                      settings.borrowNotifications
                    }
                    onChange={
                      handleChange
                    }
                    title="Borrow Notifications"
                    description="Notify members when a book is borrowed."
                  />

                  <ToggleField
                    name="returnNotifications"
                    checked={
                      settings.returnNotifications
                    }
                    onChange={
                      handleChange
                    }
                    title="Return Notifications"
                    description="Notify members when a book is returned."
                  />

                  <ToggleField
                    name="overdueNotifications"
                    checked={
                      settings.overdueNotifications
                    }
                    onChange={
                      handleChange
                    }
                    title="Overdue Notifications"
                    description="Send notifications about overdue books."
                  />

                  <ToggleField
                    name="reviewNotifications"
                    checked={
                      settings.reviewNotifications
                    }
                    onChange={
                      handleChange
                    }
                    title="Review Notifications"
                    description="Notify administrators when a new review is submitted."
                  />

                </div>

                <SaveActions
                  saving={saving}
                  onSave={handleSave}
                  onReset={handleReset}
                />

              </SettingsSection>
            )}

          {/* ==================================================
                        SECURITY
                    ================================================== */}

          {activeTab ===
            "security" && (
              <SettingsSection
                title="Security"
                description="Change the administrator account password."
              >

                <div className="max-w-xl space-y-5">

                  <PasswordField
                    label="Current Password"
                    name="currentPassword"
                    value={
                      settings.currentPassword
                    }
                    onChange={
                      handleChange
                    }
                    show={
                      showPassword
                    }
                    onToggle={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  />

                  <PasswordField
                    label="New Password"
                    name="newPassword"
                    value={
                      settings.newPassword
                    }
                    onChange={
                      handleChange
                    }
                    show={
                      showPassword
                    }
                    onToggle={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  />

                  <PasswordField
                    label="Confirm New Password"
                    name="confirmPassword"
                    value={
                      settings.confirmPassword
                    }
                    onChange={
                      handleChange
                    }
                    show={
                      showPassword
                    }
                    onToggle={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  />

                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
                  For security, use a strong
                  password containing a
                  combination of letters,
                  numbers and special
                  characters.
                </div>

                <div className="flex flex-wrap justify-end gap-3 mt-8 pt-6 border-t">

                  <button
                    type="button"
                    onClick={() => {
                      setSettings(
                        (prev) => ({
                          ...prev,
                          currentPassword:
                            "",
                          newPassword:
                            "",
                          confirmPassword:
                            "",
                        })
                      );

                      setError("");
                      setMessage("");
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <FaUndo />
                    Clear
                  </button>

                  <button
                    type="button"
                    onClick={
                      handlePasswordChange
                    }
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaSave />

                    {saving
                      ? "Changing..."
                      : "Change Password"}
                  </button>

                </div>

              </SettingsSection>
            )}

        </div>

      </div>

    </div>
  );
};

// ============================================================
// SETTINGS TAB
// ============================================================

const SettingsTab = ({
  active,
  icon,
  title,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${active
      ? "bg-blue-50 text-blue-600"
      : "text-gray-600 hover:bg-gray-50"
      }`}
  >
    <span className="text-base">
      {icon}
    </span>

    <span className="font-medium text-sm">
      {title}
    </span>
  </button>
);

// ============================================================
// SECTION
// ============================================================

const SettingsSection = ({
  title,
  description,
  children,
}) => (
  <div>

    <div className="p-5 sm:p-6 border-b">

      <h2 className="text-xl font-bold text-gray-800">
        {title}
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        {description}
      </p>

    </div>

    <div className="p-5 sm:p-6">
      {children}
    </div>

  </div>
);

// ============================================================
// INPUT
// ============================================================

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}) => (
  <div>

    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>

    <input
      type={type}
      name={name}
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />

  </div>
);

// ============================================================
// NUMBER INPUT
// ============================================================

const NumberField = ({
  label,
  name,
  value,
  onChange,
  min,
}) => (
  <div>

    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>

    <input
      type="number"
      name={name}
      value={value ?? ""}
      onChange={onChange}
      min={min}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />

  </div>
);

// ============================================================
// PASSWORD
// ============================================================

const PasswordField = ({
  label,
  name,
  value,
  onChange,
  show,
  onToggle,
}) => (
  <div>

    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>

    <div className="relative">

      <input
        type={
          show
            ? "text"
            : "password"
        }
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {show ? (
          <FaEyeSlash />
        ) : (
          <FaEye />
        )}
      </button>

    </div>

  </div>
);

// ============================================================
// TOGGLE
// ============================================================

const ToggleField = ({
  name,
  checked,
  onChange,
  title,
  description,
}) => (
  <label className="flex items-center justify-between gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition">

    <div>

      <p className="font-medium text-gray-800">
        {title}
      </p>

      <p className="text-sm text-gray-500 mt-1">
        {description}
      </p>

    </div>

    <div className="relative shrink-0">

      <input
        type="checkbox"
        name={name}
        checked={Boolean(
          checked
        )}
        onChange={onChange}
        className="sr-only peer"
      />

      <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition" />

      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5" />

    </div>

  </label>
);

// ============================================================
// SAVE ACTIONS
// ============================================================

const SaveActions = ({
  saving,
  onSave,
  onReset,
}) => (
  <div className="flex flex-wrap justify-end gap-3 mt-8 pt-6 border-t">

    <button
      type="button"
      onClick={onReset}
      disabled={saving}
      className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
    >
      <FaUndo />
      Reset
    </button>

    <button
      type="button"
      onClick={onSave}
      disabled={saving}
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FaSave />

      {saving
        ? "Saving..."
        : "Save Changes"}
    </button>

  </div>
);

export default Settings;

