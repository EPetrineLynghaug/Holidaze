import AppButton from "./AppButton";

export default function RefreshButton({ loading, children, ...props }) {
  return (
    <AppButton
      variant="outline"
      disabled={props.disabled || loading}
      className="px-4"
      {...props}
    >
      {loading ? (
        <>
          <span className="animate-spin mr-2 material-symbols-outlined text-lg align-middle">refresh</span>
          Refreshing...
        </>
      ) : (
        <>
          <span className="mr-2 material-symbols-outlined text-lg align-middle">refresh</span>
          {children || "Refresh"}
        </>
      )}
    </AppButton>
  );
}
