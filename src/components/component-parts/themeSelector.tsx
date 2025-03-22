import { useThemeProvider } from "../../providers/theme.provider";

const ThemeSelector = () => {
  type ThemeOption = { label: string; value: string };
  const themeOptions: ThemeOption[] = [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
    { label: "Silk", value: "silk" },
    { label: "Coffee", value: "coffee" },
    { label: "Sunset", value: "sunset" },
    { label: "Cupcake", value: "cupcake" },
    { label: "Bumblebee", value: "bumblebee" },
    { label: "Emerald", value: "emerald" },
    { label: "Corporate", value: "corporate" },
    { label: "Synthwave", value: "synthwave" },
    { label: "Retro", value: "retro" },
    { label: "Pastel", value: "pastel" },
    { label: "Cyberpunk", value: "cyberpunk" },
    { label: "Valentine", value: "valentine" },
    { label: "Halloween", value: "halloween" },
    { label: "Garden", value: "garden" },
    { label: "Forest", value: "forest" },
    { label: "Aqua", value: "aqua" },
    { label: "Lofi", value: "lofi" },
    { label: "Fantasy", value: "fantasy" },
    { label: "Wireframe", value: "wireframe" },
    { label: "Black", value: "black" },
    { label: "Luxury", value: "luxury" },
    { label: "Dracula", value: "dracula" },
    { label: "Cmyk", value: "cmyk" },
    { label: "Autumn", value: "autumn" },
    { label: "Business", value: "business" },
    { label: "Acid", value: "acid" },
    { label: "Lemonade", value: "lemonade" },
    { label: "Night", value: "night" },
    { label: "Winter", value: "winter" },
    { label: "Dim", value: "dim" },
    { label: "Nord", value: "nord" },
    { label: "Caramellatte", value: "caramellatte" },
    { label: "Sunset", value: "sunset" },
    { label: "Abyss", value: "abyss" },
  ];
  const { theme, updateTheme } = useThemeProvider();
  return (
    <label className="btn btn-secondary max-w-xs">
      <span className="label text-lg text-base-100">Theme</span>
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
