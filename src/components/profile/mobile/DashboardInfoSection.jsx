export default function DashboardInfoSection({ user }) {
    const isVenue = user?.venueManager;
  return (
    <section className="w-full px-2 space-y-5 mt-6 lg:px-0 lg:w-full">
      <h2 className="text-xl lg:text-2xl font-semibold text-gray-900">
        Dashboard
      </h2>

      {/* Velkomst */}
      <div className="space-y-2">
        <p className="text-base lg:text-lg font-medium text-gray-900">
          {isVenue
            ? "Welcome to your Venue Control Center!"
            : "Welcome to your Dashboard!"}
        </p>
        <p className="text-sm lg:text-base font-normal text-gray-700">
          {isVenue
            ? "Get an instant visual overview of your venue's booking activity. Easily monitor booking trends, occupancy rates, and manage your active venues efficiently."
            : "Here you can manage your profile, view your bookings and explore venues. Upgrade to Venue mode to unlock analytics and management tools!"}
        </p>
      </div>

      {/* Venue - ekstra info */}
      {isVenue && (
        <div className="space-y-2">
          <p className="text-base lg:text-lg font-medium text-gray-900">
            Quickly edit venue:
          </p>
          <p className="text-sm lg:text-base font-normal text-gray-700">
            Details, remove venues, or temporarily disable listings directly from your active venue list.
          </p>
        </div>
      )}

      {/* Tilbakemelding */}
      <div className="space-y-2">
        <p className="text-base lg:text-lg font-medium text-gray-900">
          Feedback Matters:
        </p>
        <p className="text-sm lg:text-base font-normal text-gray-700">
          Use the sidebar to rate and share feedback from your latest rental experience, helping you enhance the quality of future stays.
        </p>
      </div>

      {/* Profiladministrasjon */}
      <div className="space-y-2">
        <p className="text-base lg:text-lg font-medium text-gray-900">
          Manage Your Profile:
        </p>
        <p className="text-sm lg:text-base font-normal text-gray-700">
          {isVenue
            ? "Visit Settings to change your venue status, update your profile image, and modify other important information about your venue."
            : "Visit Settings to update your profile and manage your account. You can upgrade to Venue mode at any time."}
        </p>
      </div>
    </section>
  );
}
