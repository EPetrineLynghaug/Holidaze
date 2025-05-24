export default function VenueDescription({ description }) {
  if (!description) return null;
  return (
    <section className="mt-0 mb-6 px-4 max-w-3xl">
      <h2 className="font-semibold text-2xl mb-4 text-left text-gray-900 tracking-wide">
        Description
      </h2>
      <p className=" lg:text-base font-normal text-gray-700 whitespace-pre-line text-left">
        {description.replace(/^Description:\s*/i, "")}
      </p>
    </section>
  );
}
