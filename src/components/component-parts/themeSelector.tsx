import { useThemeProvider } from "../../providers/theme.provider";

const ThemeSelector = () => {
  type ThemeOption = { label: string; value: string };
  const themeOptions: ThemeOption[] = [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
    { label: "Silk", value: "silk" },
    { label: "Lofi", value: "lofi" },
    { label: "Wireframe", value: "wireframe" },
    { label: "Black", value: "black" },
    { label: "Acid", value: "acid" },
    { label: "Abyss", value: "abyss" },
    { label: "Forest", value: "forest" },
    { label: "Bumblebee", value: "bumblebee" },
    { label: "Emerald", value: "emerald" },
    { label: "Corporate", value: "corporate" },
    { label: "Synthwave", value: "synthwave" },
    { label: "Retro", value: "retro" },
    { label: "Pastel", value: "pastel" },
    { label: "Cyberpunk", value: "cyberpunk" },
    { label: "Garden", value: "garden" },
    { label: "Valentine", value: "valentine" },
    { label: "Halloween", value: "halloween" },
    { label: "Aqua", value: "aqua" },
    { label: "Fantasy", value: "fantasy" },
    { label: "Luxury", value: "luxury" },
    { label: "Dracula", value: "dracula" },
    { label: "Cmyk", value: "cmyk" },
    { label: "Autumn", value: "autumn" },
    { label: "Business", value: "business" },
    { label: "Coffee", value: "coffee" },
    { label: "Cupcake", value: "cupcake" },
    { label: "Lemonade", value: "lemonade" },
    { label: "Night", value: "night" },
    { label: "Winter", value: "winter" },
    { label: "Dim", value: "dim" },
    { label: "Nord", value: "nord" },
    { label: "Caramellatte", value: "caramellatte" },
    { label: "Sunset", value: "sunset" },
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
