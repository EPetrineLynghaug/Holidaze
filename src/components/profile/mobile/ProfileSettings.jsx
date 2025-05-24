import React, { useState } from "react";
import useProfileSettings from "../../../hooks/api/useProfileSettings";
import ToggleSwitch from "../../ui/buttons/Toggle";
import AlertPopup from "../../ui/popup/AlertPopup";
import BottomSheet from "../../ui/popup/BottomSheet";

export default function ProfileSettingsMobile({ userName, onSave, onClose }) {
  const {
    profile,
    setProfile,
    loadingProfile,
    errorProfile,
    savingProfile,
    errorSave,
    saveProfile,
  } = useProfileSettings(userName);

  const [alert, setAlert] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const handleField = (section, key) => (e) => {
    const value = e.target.value;
    setProfile((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
  };

  const handleToggle = (enabled) => {
    setProfile((prev) => ({ ...prev, venueManager: enabled }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await saveProfile();
      onSave(updated);
      setAlert({
        open: true,
        type: "success",
        title: "Settings Saved!",
        message: "Your profile settings have been updated.",
      });
      onClose();
    } catch (err) {
      setAlert({
        open: true,
        type: "error",
        title: "Oops! Something went wrong",
        message: "We couldn't save your changes. Please try again.",
      });
    }
  };

  if (loadingProfile) return <p>Laster profil…</p>;
  if (errorProfile) return <p className="text-red-500">{errorProfile}</p>;

  return (
    <BottomSheet title="Settings" onClose={onClose}>
      {/* ALERT POPUP */}
      {alert.open && (
        <AlertPopup
          open={alert.open}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert((a) => ({ ...a, open: false }))}
          duration={2200}
        />
      )}

      <form onSubmit={onSubmit} className="flex flex-col h-full">
        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-base font-medium">
                Enable Venue Manager
              </label>
              <p className="text-sm text-gray-500">
                Switch between Traveler & Venue modes
              </p>
            </div>
            <ToggleSwitch
              checked={profile.venueManager}
              onChange={handleToggle}
              label="Toggle venue manager"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="profileUrl" className="block text-base font-medium">
              Profile Picture URL
            </label>
            <input
              id="profileUrl"
              type="url"
              value={profile.avatar.url || ""}
              onChange={handleField("avatar", "url")}
              placeholder="https://…/profile.jpg"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-300 focus:border-purple-300"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="bannerUrl" className="block text-base font-medium">
              Banner Image URL
            </label>
            <input
              id="bannerUrl"
              type="url"
              value={profile.banner.url || ""}
              onChange={handleField("banner", "url")}
              placeholder="https://…/banner.jpg"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-300 focus:border-purple-300"
            />
          </div>
        </div>

        {/* Footer Save */}
        <div className="p-4 bg-white border-t border-purple-100">
          <button
            type="submit"
            disabled={savingProfile}
            className="w-full py-3 bg-purple-300 hover:bg-purple-400 text-white rounded-lg font-semibold"
          >
            {savingProfile ? "Saving…" : "Save Settings"}
          </button>
          {errorSave && <p className="text-red-500">{errorSave}</p>}
        </div>
      </form>
    </BottomSheet>
  );
}
