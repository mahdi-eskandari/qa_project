// import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ThemeProvider from "./utils/Theme";
import { ReduxProvider } from "./redux/reduxProvider";

export const metadata = {
  title: "Q & A",
  description: "Questions & Answers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{marginTop: "120px"}}>
        <ReduxProvider>
          <ThemeProvider>
            <div>
              <Header />
            </div>
            {children}
            <Footer />
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
