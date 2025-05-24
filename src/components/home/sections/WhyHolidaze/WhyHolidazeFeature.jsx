export default function WhyHolidazeFeature({ iconName, title, description }) {
  return (
    <div
      className="flex max-w-xs items-start space-x-4 lg:flex-col  lg:space-x-0 lg:space-y-4">
      <span
        className="material-symbols-outlined feature-icon text-indigo-600 text-4xl lg:pl-17 flex-shrink-0"
      >
        {iconName}
      </span>

      <div>
<h3 className="text-lg font-regular text-gray-900">{title}</h3>
<p className="mt-1 text-sm text-gray-600 leading-relaxed lg:text-left ">
  {description}
</p>
      </div>
    </div>
  );
}
