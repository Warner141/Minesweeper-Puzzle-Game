export default function validate(
  username: string,
  password: string,
  confirmPassword: string,
) {
  const containsLetter = /(?=.*[a-zA-Z])/;
  const containsNumber = /(?=.*[0-9])/;
  const containsSpecial = /(?=.*[!@#$%^&*_-])/;
  const onlyValidUsernameChar = /^[a-zA-Z0-9_-]+$/;
  const startsWithLetter = /^[a-zA-Z]/;
  const noReservedWords = /^(?!(?:admin|root|null)$).+$/;
  const noSpaces = /^\S+$/;

  // Username checks
  if (username.length < 5 || username.length > 20)
    return "Your username must be between 5 and 20 characters";
  if (!startsWithLetter.test(username))
    return "Your username must start with a letter";
  if (!onlyValidUsernameChar.test(username))
    return "Your username can only include letters, numbers, underscore, and hyphen";
  if (!noReservedWords.test(username))
    return "That username is reserved, please choose another";

  // Password checks
  if (password.length < 8 || password.length > 64)
    return "Your password must be between 8 and 64 characters";
  if (!noSpaces.test(password)) return "Your password cannot contain spaces";
  if (!containsLetter.test(password))
    return "Your password must contain at least one letter";
  if (!containsNumber.test(password))
    return "Your password must contain at least one number";
  if (!containsSpecial.test(password))
    return "Your password must contain at least one special character (!@#$%^&*_-)";

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  return "";
}
