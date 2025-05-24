

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          
          {/* Left: logo / copyright */}
          <p className="text-sm text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} Holidaze. All rights reserved.
          </p>

          {/* Middle: contact */}
          <a
            href="mailto:hallo@holidaze.com"
            className="text-sm text-indigo-600 hover:underline"
          >
            hallo@holidaze.com
          </a>

          {/* Right: navigation */}
          <div className="flex space-x-4 text-sm">
            <a href="/login" className="text-gray-500 hover:text-gray-900">
              Login
            </a>
            <a href="/terms" className="text-gray-500 hover:text-gray-900">
              Terms
            </a>
            <a href="/privacy" className="text-gray-500 hover:text-gray-900">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
