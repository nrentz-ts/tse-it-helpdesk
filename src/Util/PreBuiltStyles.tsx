import { customCssInterface } from "@thoughtspot/visual-embed-sdk/lib/src/types";

const DarkModeColors = {
  primary: "#343434",
  secondary: "#efefef",
};
const PurpleGreenColors = {
  primary: "#304286",
  secondary: "#ffffff",
  button: "#86BDBB",
  backgound: "#EDF2F7",
};
export enum StyleOptionList {
  None = "None",
  Default = "Default",
  // DarkMode = "DarkMode",
  // PurpleGreen = "PurpleGreen",
  // BlueHeader = "BlueHeader",
  // OrangeWhite = "OrangeWhite",
  // Greenish = "Greenish",
  // Pinelopi0605 = "Pinelopi0605",
  MetricsPulse = "MetricsPulse",
}
interface CustomStyle {
  name: string;
  customCSS: customCssInterface;
}
export const StyleOptions: CustomStyle[] = [
  {
    name: StyleOptionList.MetricsPulse,
    customCSS: {
      variables: {
        "--ts-var-root-background": "#f8fafc",
        "--ts-var-root-color": "#232946",
        "--ts-var-root-font-family": "'Inter', Arial, sans-serif",
        "--ts-var-nav-background": "#0a0a2d",
        "--ts-var-nav-color": "#fff",
        "--ts-var-application-color": "#232946",
      
        "--ts-var-button-border-radius": "8px",
        "--ts-var-button--icon-border-radius": "8px",
      
        "--ts-var-button--primary-background": "#0a0a2d",
        "--ts-var-button--primary-color": "#fff",
        "--ts-var-button--primary--hover-background": "#232946",
      
        "--ts-var-button--secondary-background": "#EFEFF1",
        "--ts-var-button--secondary-color": "#08072D",
        "--ts-var-button--secondary--hover-background": "#e3e3e8",
        "--ts-var-button--secondary--active-background": "#d6d6db",
      
        "--ts-var-menu-background": "#fff",
        "--ts-var-menu-color": "#232946",
      
        "--ts-var-dialog-body-background": "#fff",
        "--ts-var-dialog-header-background": "#fff",
        "--ts-var-dialog-body-color": "#232946",
        "--ts-var-dialog-header-color": "#232946",
      
        "--ts-var-list-selected-background": "#f0f1f6",
        "--ts-var-list-hover-background": "#f5f6fa",
      
        "--ts-var-viz-background": "#fff",
        "--ts-var-viz-title-color": "#232946",
        "--ts-var-viz-description-color": "#6b7280",
      
        "--ts-var-chip-background": "#f0f1f6",
        "--ts-var-chip-color": "#232946",
        "--ts-var-chip-border-radius": "8px",
      
        "--ts-var-axis-title-color": "#232946",
        "--ts-var-axis-data-label-color": "#6b7280",
      
        "--ts-var-search-bar-background": "#fff",
        "--ts-var-search-bar-text-font-color": "#232946",
        "--ts-var-search-data-button-background": "#fff",
        "--ts-var-search-data-button-font-color": "#232946",
      
        "--ts-var-liveboard-edit-bar-background": "#fff",
        "--ts-var-liveboard-cross-filter-layout-background": "#fff",
        "--ts-var-kpi-analyze-text-color": "#232946",
        "--ts-var-liveboard-tab-active-border-color": "#232946",
        "--ts-var-liveboard-tab-hover-color": "#36688D"        
      }
    },
  },
  {
    name: StyleOptionList.Default,
    customCSS: {
      variables: {
        "--ts-var-root-background": "#F5F8FA",
      },
    },
  },
];
