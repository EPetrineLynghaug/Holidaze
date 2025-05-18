
export const venueValidationRules = {
  title: {
    required: true,
    minLength: 4,
    maxLength: 100,
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 4000,
  },
  address: {
    required: true,
    minLength: 4,
    maxLength: 200,
    pattern: /\d+/,
    patternMessage: "Must include at least one number",
  },
  city: {
    required: true,
    minLength: 4,
    maxLength: 100,
  },
  country: {
    required: true,
    minLength: 4,
    maxLength: 100,
  },
  price: {
    required: true,
    pattern: /^[1-9]\d*$/,
    patternMessage: "Must be a positive number",
  },
  guests: {
    required: true,
    pattern: /^[1-9]\d*$/,
    patternMessage: "Must be at least 1 guest",
  },
};
