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
  Telvanta = "Telvanta",
  Nexora = "Nexora",

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
        "--ts-var-root-background": "#F6F4F5",
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
        "--ts-var-kpi-hero-color": "black",
        "--ts-var-liveboard-tab-active-border-color": "#232946",
        "--ts-var-liveboard-tab-hover-color": "#36688D"        
      }
    },
  },
  {
    name: StyleOptionList.Nexora,
    customCSS: {
      variables: {
        "--ts-var-root-background": "#EAE9E3",
        "--ts-var-root-color": "#1D232F",
        "--ts-var-nav-background": "#0a0a2d",
        "--ts-var-nav-color": "#fff",
        "--ts-var-application-color": "#232946",
      
        "--ts-var-button-border-radius": "8px",
      
      
        "--ts-var-button--primary-background": "#476B59",
        "--ts-var-button--primary--hover-background": "#385746",
        "--ts-var-button--primary--active-background": "#273C2E",
        "--ts-var-button--primary-color": "#fff",
      
        "--ts-var-button--secondary-background": "#EAEDF2",
        "--ts-var-button--secondary-color": "#08072D",
        "--ts-var-button--secondary--hover-background": "#e3e3e8",
        "--ts-var-button--secondary--active-background": "#d6d6db",
      
        "--ts-var-menu-background": "#fff",
        "--ts-var-menu-color": "#232946",
      
        "--ts-var-viz-background": "#fff",
        "--ts-var-viz-title-color": "#232946",
        "--ts-var-viz-description-color": "#6b7280",
      
        "--ts-var-chip-background": "#f0f1f6",
        "--ts-var-chip-color": "#232946",
      
        "--ts-var-kpi-analyze-text-color": "var(--ts-var-liveboard-tab-active-border-color)",
        "--ts-var-kpi-hero-color": "black",
        "--ts-var-liveboard-tab-active-border-color": "#476B59",
        "--ts-var-liveboard-tab-hover-color": "var(--ts-var-button--primary--active-background)",
      }
    },
  },
  {
    name: StyleOptionList.Telvanta,
    customCSS: {
      variables: {
        "--ts-var-root-background": "#1D232F",
        "--ts-var-root-color": "#FFFFFF",
        "--ts-var-nav-background": "#0a0a2d",
        "--ts-var-nav-color": "#fff",
        "--ts-var-application-color": "#232946",
      
        "--ts-var-button-border-radius": "8px",
        "--ts-var-button--icon-border-radius": "8px",
      
      
        "--ts-var-button--primary-background": "#6A4ABA",
        "--ts-var-button--primary--hover-background": "#573C97",
        "--ts-var-button--primary--active-background": "#3F2A6B",
        "--ts-var-button--primary-color": "#fff",
      
        "--ts-var-button--secondary-background": "#4A515E",
        "--ts-var-button--secondary--hover-background": "#3A3F4D",
        "--ts-var-button--secondary--active-background": "#292C36",
        "--ts-var-button--secondary-color": "#A5ACB9",
      
        "--ts-var-menu-background": "#fff",
        "--ts-var-menu-color": "#232946",
      
        "--ts-var-viz-background": "#323946",
        "--ts-var-viz-title-color": "var(--ts-var-root-color)",
        "--ts-var-viz-description-color": "var(--ts-var-root-color)",
      
        "--ts-var-chip-background": "#4A515E",
        "--ts-var-chip-color": "var(--ts-var-root-color)",
      
        "--ts-var-kpi-analyze-text-color": "var(--ts-var-button--secondary-color)",
        "--ts-var-kpi-hero-color": "var(--ts-var-root-color)",
        "--ts-var-kpi-comparison-color": "#A5ACB9",

        "--ts-var-liveboard-tab-active-border-color": "#6A4ABA",
        "--ts-var-liveboard-tab-hover-color": "var(--ts-var-button--secondary-color)",
      },
      rules_UNSTABLE: {
        ".kpi-module__diffLabelAnomalyV2": {
          background: "#323946 !important",
        },
      },
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
