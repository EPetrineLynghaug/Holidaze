export default function DashboardInfoMobile() {
    return (
      <section className="md:hidden max-w-2xl mx-auto px-4  space-y-5">
        {/* Seksjonstittel */}
        <h2 className="text-lg font-normal text-gray-900">Dashboard</h2>
  
        {/* 1 – Velkomst */}
        <div>
          <p className="text-base font-normal text-gray-900">
            Welcome to your Venue Control Center!
          </p>
          <p className="mt-1 text-sm font-normal text-gray-600">
            Get an instant visual overview of your venue&apos;s booking activity.
            Easily monitor booking trends, occupancy rates, and manage your active
            venues efficiently:
          </p>
        </div>
  
        {/* 2 – Rask redigering */}
        <div>
          <p className="text-base font-normal text-gray-900">
            Quickly edit venue&nbsp;:
          </p>
          <p className="mt-1 text-sm font-normal text-gray-600">
            Details, remove venues, or temporarily disable listings directly from
            your active venue list.
          </p>
        </div>
  
        {/* 3 – Tilbakemelding */}
        <div>
          <p className="text-base font-normal text-gray-900">
            Feedback Matters&nbsp;:
          </p>
          <p className="mt-1 text-sm font-normal text-gray-600">
            Use the sidebar to rate and share feedback from your latest rental
            experience, helping you enhance the quality of future stays.
          </p>
        </div>
  
        {/* 4 – Profiladministrasjon */}
        <div>
          <p className="text-base font-normal text-gray-900">
            Manage Your Venue Profile&nbsp;:
          </p>
          <p className="mt-1 text-sm font-normal text-gray-600">
            Visit Settings to change your venue status, update your profile image,
            and modify other important information about your venue.
          </p>
        </div>
      </section>
    );
  }
  