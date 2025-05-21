import AppButton from "./AppButton";

export default function LoadMoreButton({ loading, children, ...props }) {
  return (
    <AppButton
      variant="primary"
      disabled={props.disabled || loading}
      className="px-5"
      {...props}
    >
      {loading ? (
        <>
          <span className="animate-spin mr-2 material-symbols-outlined text-lg align-middle">autorenew</span>
          Loading...
        </>
      ) : (
        <>
          <span className="mr-2 material-symbols-outlined text-lg align-middle">arrow_forward</span>
          {children || "Load Next"}
        </>
      )}
    </AppButton>
  );
}
