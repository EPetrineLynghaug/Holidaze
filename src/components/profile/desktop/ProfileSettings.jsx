import  { useState } from "react";
import useProfileSettings from "../../../hooks/api/useProfileSettings";
import ToggleSwitch from "../../ui/buttons/Toggle";
import AlertPopup from "../../ui/mobildemodal/AlertPopup";

const Section = ({ icon, title, children }) => (
  <section className="bg-white shadow rounded-lg w-full max-w-6xl p-6 md:p-8 space-y-6 ring-1 ring-gray-100 text-left">
    <h2 className="flex items-center gap-2 text-lg md:text-xl font-semibold text-purple-700">
      <span className="material-symbols-outlined text-purple-600" aria-hidden>
        {icon}
      </span>
      {title}
    </h2>
    {children}
  </section>
);

export default function ProfileSettingsPage({ userName, onSave }) {
  const {
    profile,
    setProfile,
    loadingProfile,
    errorProfile,
    savingProfile,
    errorSave,
    saveProfile,
  } = useProfileSettings(userName);

  // --- Alert state ---
  const [alert, setAlert] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  // Update profile fields
  const handleField = (section, key) => (e) => {
    const value = e.target.value;
    setProfile((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
  };

  // Toggle venueManager
  const handleToggle = (enabled) => {
    setProfile((prev) => ({ ...prev, venueManager: enabled }));
  };

  // Submit handler
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await saveProfile();
      onSave(updated); // Oppdater dashboard/parent, viktig!
      setAlert({
        open: true,
        type: "success",
        title: "Settings Saved!",
        message: "Your profile settings have been updated.",
      });
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
    <main className="w-full max-w-none ml-0 max-h-screen overflow-y-auto scrollbar-hide">
      {/* ALERT POPUP */}
      {alert.open && (
        <AlertPopup
          open={alert.open}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(a => ({ ...a, open: false }))}
          duration={2200}
        />
      )}

      <form
        onSubmit={onSubmit}
        className="mt-10 mb-20 px-4 md:px-20 lg:px-64 max-h-screen overflow-y-auto scrollbar-hide space-y-8"
      >
        <header className="space-y-2 text-left">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Profile Settings
          </h1>
          <p className="text-gray-600">
            Manage your profile pictures and mode
          </p>
        </header>

        {/* Venue Manager Section */}
        <Section icon="sync_alt" title="Venue Manager Mode">
          <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-2">
            <p className="text-sm text-gray-700 mb-2 md:mb-0">
              Switch between Traveler & Venue modes
            </p>
            <ToggleSwitch
              checked={profile.venueManager}
              onChange={handleToggle}
              label="Toggle venue manager"
            />
          </div>
        </Section>

        {/* Profile & Banner Images Section */}
        <Section icon="image" title="Profile & Banner Images">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {/* Avatar Preview + Inputs */}
            <div className="space-y-6 w-full">
              {profile.avatar.url && (
                <div className="flex justify-center">
                  <img
                    src={profile.avatar.url}
                    alt={profile.avatar.alt || "Profile preview"}
                    className="w-40 h-40 object-cover rounded-full border-4 border-purple-500 shadow-lg"
                  />
                </div>
              )}
              <label htmlFor="profileUrl" className="block text-sm font-medium text-gray-700">
                Profile Picture URL
              </label>
              <input
                id="profileUrl"
                type="url"
                value={profile.avatar.url || ""}
                onChange={handleField("avatar", "url")}
                className="w-full rounded-xl border border-gray-300 px-4 py-2"
              />
              <label htmlFor="profileAlt" className="block text-sm font-medium text-gray-700">
                Profile Picture Alt Text
              </label>
              <input
                id="profileAlt"
                type="text"
                value={profile.avatar.alt || ""}
                onChange={handleField("avatar", "alt")}
                className="w-full rounded-xl border border-gray-300 px-4 py-2"
              />
            </div>

            {/* Banner Preview + Inputs */}
            <div className="space-y-6 w-full">
              {profile.banner.url && (
                <div className="flex justify-center">
                  <img
                    src={profile.banner.url}
                    alt={profile.banner.alt || "Banner preview"}
                    className="w-full h-40 object-cover rounded-lg shadow-lg border border-gray-300"
                  />
                </div>
              )}
              <label htmlFor="bannerUrl" className="block text-sm font-medium text-gray-700">
                Banner Image URL
              </label>
              <input
                id="bannerUrl"
                type="url"
                value={profile.banner.url || ""}
                onChange={handleField("banner", "url")}
                className="w-full rounded-xl border border-gray-300 px-4 py-2"
              />
              <label htmlFor="bannerAlt" className="block text-sm font-medium text-gray-700">
                Banner Image Alt Text
              </label>
              <input
                id="bannerAlt"
                type="text"
                value={profile.banner.alt || ""}
                onChange={handleField("banner", "alt")}
                className="w-full rounded-xl border border-gray-300 px-4 py-2"
              />
            </div>
          </div>
        </Section>

        {/* Save Button & Error */}
        <div className="flex justify-end w-full">
          <button
            type="submit"
            disabled={savingProfile}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow hover:bg-purple-700 transition mb-40 disabled:opacity-50"
          >
            {savingProfile ? "Saving…" : "Save Settings"}
          </button>
        </div>
        {errorSave && <p className="text-red-500">{errorSave}</p>}
      </form>
    </main>
  );
}
