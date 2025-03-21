import { useThemeProvider } from "../../providers/theme.provider";

const ThemeSelector = () => {
  type ThemeOption = { label: string; value: string };
  const themeOptions: ThemeOption[] = [
    { label: "Dark", value: "dark" },
    { label: "Coffee", value: "coffee" },
    { label: "Sunset", value: "sunset" },
    { label: "Emerald", value: "emerald" },
    { label: "Light", value: "light" },
  ];
  const { theme, updateTheme } = useThemeProvider();
  return (
    <label className="form-control w-full max-w-xs">
      <span className="label text-lg text-primary-content">Theme</span>
      <select
        value={theme}
        onChange={(e) => updateTheme(e.target.value as ThemeType)}
      >
        {themeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};

export default ThemeSelector;
