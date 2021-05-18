import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      darkPrimary: string;
      secondary: string;
      text: string;
      secondaryText: string;
      error: string;
    };
    fontFamily: {
      sitkaHeading: string;
      segoeUI: string;
      segoeUIBold: string;
      segoeUISemiBold: string;
    };
  }
}
