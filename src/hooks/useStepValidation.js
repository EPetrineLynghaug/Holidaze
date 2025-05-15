export function useStepValidation(step, form) {
  return useMemo(() => {
    switch (step) {
      case 0:
        // Title must be at least 3 characters and not purely numeric
        const titleTrimmed = form.title.trim();
        const validTitle = titleTrimmed.length >= 3 && isNaN(titleTrimmed);
        return (
          validTitle &&
          !!form.description.trim() &&
          !!form.location.address.trim() &&
          !!form.location.city.trim() &&
          !!form.location.country.trim()
        );
      case 1:
        return form.images.filter((u) => !!u).length > 0;
      case 2:
        return (
          form.environments.length > 0 ||
          form.audiences.length > 0 ||
          form.facilities.length > 0
        );
      case 3:
        return form.dateRange.startDate <= form.dateRange.endDate;
      case 4:
        return form.price !== "" && form.guests >= 1;
      default:
        return false;
    }
  }, [step, form]);
}
