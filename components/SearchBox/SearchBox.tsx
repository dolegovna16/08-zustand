import css from "./SearchBox.module.css";

interface SearchBoxProps {
  handleSearch: (value: string) => void;
}

export default function SearchBox({ handleSearch }: SearchBoxProps) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value);
  };

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      onChange={onChange}
    />
  );
}