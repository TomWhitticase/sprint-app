export default function isValidPassword(password: string) {
  const validLength = password.length >= 8 && password.length <= 20;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialCharacter = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
    password
  );

  const passwordConditions = [
    {
      condition: validLength,
      message: "Password must be between 8 and 20 characters",
    },
    {
      condition: hasUpperCase,
      message: "Password must contain at least one uppercase letter",
    },
    {
      condition: hasLowerCase,
      message: "Password must contain at least one lowercase letter",
    },
    {
      condition: hasNumber,
      message: "Password must contain at least one number",
    },
    {
      condition: hasSpecialCharacter,
      message: "Password must contain at least one special character",
    },
  ];

  return {
    isValid: passwordConditions.every((condition) => condition.condition),
    conditions: passwordConditions,
  };
}
