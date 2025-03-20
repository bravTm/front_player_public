import { LangContext } from "app/provider/LangProvider";
import { useContext } from "react";

export const useLang = () => useContext(LangContext);