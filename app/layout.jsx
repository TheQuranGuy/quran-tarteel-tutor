import "../styles/globals.css";
import NavBar from "../components/cosmic/NavBar";
import UserSession from "../components/UserSession";
import { XPProvider } from "../context/XPContext";

export const metadata = { title: "Quran Tarteel", description: "A Qur'an learning universe" };

export default function RootLayout({ children }) {
  return <html lang="en"><body><XPProvider><UserSession /><NavBar />{children}</XPProvider></body></html>;
}
