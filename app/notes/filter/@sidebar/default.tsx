import { NoteTag } from "@/types/note";
import css from "./SidebarNotes.module.css";
import Link from "next/link";

const TagsMenu = () => {
  const noteTags = Object.values(NoteTag);

  return (
    <ul className={css.menuList}>
      <li className={css.menuItem}>
        <Link className={css.menuLink} href={"/notes/filter/All"}>
          All notes
        </Link>
      </li>
      {noteTags.map((tag) => (
        <li key={tag} className={css.menuItem}>
          <Link className={css.menuLink} href={`/notes/filter/${tag}`}>
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default TagsMenu;