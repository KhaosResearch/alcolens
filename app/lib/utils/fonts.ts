import localFont from "next/font/local";

export const primaryFontRegular = localFont({ 
  src: '../../../public/fonts/PPRadioGrotesk-Regular.otf',
  variable: '--font-primary',
  display: 'auto' 
});


export const primaryFontBold = localFont({
    src: "../../../public/fonts/PPRadioGrotesk-Black.otf",
    variable: "--font-primary-bold",
    display: "auto",
});