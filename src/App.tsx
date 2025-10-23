import React, { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import useLocalStorage from "./Util/LocalStorage";
import { SubMenu } from "./Settings/SubMenuConfiguration";
import LeftNav from "./Views/LeftNav";
import SubMenuView from "./Views/SubMenuView";
import {
  ThoughtSpotObject,
  ThoughtSpotObjectType,
} from "./Settings/ThoughtSpotObjectConfiguration";
import ThoughtSpotObjectView from "./Views/ThoughtSpotObjectView";
import {
  Action,
  AuthStatus,
  AuthType,
  EmbedEvent,
  HostEvent,
  LogLevel,
  RuntimeFilter,
  customCssInterface,
  init,
} from "@thoughtspot/visual-embed-sdk";
import {
  LiveboardEmbed,
  PreRenderedLiveboardEmbed,
  PreRenderedConversationEmbed,
  SpotterEmbed,
  useEmbedRef,
} from "@thoughtspot/visual-embed-sdk/react";
import RestReportsList from "./Views/RestReportsList";
import LoginPopup from "./Views/Popups/LoginPopup";
import { createClientWithoutAuth } from "./Util/Util";
import HomePageView from "./Views/HomePage";
import { CSSOverrides, StringOverrides, IconSpriteOverrides, defaultSettings } from "./Util/Types";
import SpotterView from "./Views/SpotterView";
import KPIChartView from "./Views/KPIChart";
import SubMenuDetailsView from "./Views/SubMenuDetailsView";
import { User } from "./Settings/UserConfiguration";
import {
  CleanPath,
  GetAvailableDemos,
  GetDemo,
} from "./Settings/Git/GitSettings";
import { inject } from "@vercel/analytics";
import FirstLoginWelcome from "./Views/FirstLoginWelcome";
import TopNav from "./Views/TopNav";
import SimpleSpotterView from "./Views/ThoughtSpotEmbeds/SimpleSpotterView";
import SimpleSearchView from "./Views/ThoughtSpotEmbeds/SimpleSearchView";
import SimpleFullAppView from "./Views/ThoughtSpotEmbeds/FullAppView";
import PresentMode from "./Views/Popups/PresentMode";
import { ChatIcon } from "./Views/BodylessSpotter/Chat/Icon";
import { Chat } from "./Views/BodylessSpotter/Chat/Chat";
import { Thread } from "./Views/BodylessSpotter/Services/chat-service-completions";
import { useStore } from "./Views/BodylessSpotter/Store";
import { CloseButton } from "./Settings/Inputs/InputMenus";
import { Settings } from "./Settings/SettingsConfiguration";

/*  Main Application Component

  This component is the main application component that controls the entire application.
  It uses the ThoughtSpot SDK to embed ThoughtSpot objects and visualizations into the application.
  The application is configured using the settings object which is stored in local storage.
  The application is styled using Tailwind CSS and custom CSS overrides.

  The application is broken down into several components:
    - LeftNav: The left navigation bar that contains the main navigation links
    - SubMenuView: The view that displays the sub menu
    - ThoughtSpotObjectView: The view that displays the ThoughtSpot object
    - RestReportsList: The view that displays the list of reports from the REST API
    - SpotterView: The view that displays the Spotter search bar
    - HomePageView: The view that displays the home page
    - KPIChartView: The view that displays the KPI chart
    - SubMenuDetailsView: The view that displays the sub menu details
    - UserProfile: The user profile component
    - LoginPopup: The login popup component
    - SpotterQuestionPrompt: The Spotter question prompt component

  The application uses several contexts to manage state:
    - TSLoginContext: A context to manage the ThoughtSpot login status
    - SettingsContext: A context to manage the application settings
    - UserContext: A context to manage the application user

*/
inject();
export enum PageType {
  HOMEIMAGE,
  ANALYTICSHOME,
  FAVORITES,
  MYREPORTS,
  SIMPLESPOTTER,
  SIMPLESEARCH,
  SIMPLEFULLAPP,
  SUBMENU,
}

export interface Page {
  type: PageType;
  subMenu?: SubMenu;
}
// Create a context for the TS login status
export const TSLoginContext = React.createContext({
  isLoggedIn: false,
  setIsLoggedIn: (isLoggedIn: boolean) => {},
});
// Create a context for the application settings
export const SettingsContext = React.createContext({
  settings: {} as Settings,
  setSettings: (settings: Settings) => {},
});
// Create a context for the application user (not related to TS user)
export const UserContext = React.createContext({
  user: {} as User,
  setUser: (user: User) => {},
});
function App() {
  //Keep settings, page, user, and thoughtspot object in local storage so they dont disappear on refresh
  const [settings, setSettings] = useLocalStorage("settings", defaultSettings);
  const [selectedPage, setSelectedPage] = useLocalStorage(
    "page",
    null as Page | null
  );
  const [user, setUser] = useLocalStorage("user", defaultSettings.users[0]);
  const [selectedThoughtSpotObject, setSelectedThoughtSpotObject] =
    useLocalStorage("thoughtspotObject", null as ThoughtSpotObject | null);

  // Login status for ThoughtSpot
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Visibility states for the settings and spotter embed
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showSpotter, setShowSpotter] = useState<boolean>(false);
  const [loginPopupVisible, setLoginPopupVisible] = useState<boolean>(false);
  const [presentModeVisible, setPresentModeVisible] = useState<boolean>(false);

  // State for the spotter prompt
  const [spotterLoaded, setSpotterLoaded] = useState<boolean>(false);
  const [spotterPrompt, setSpotterPrompt] = useState<string>("");
  
  // Flag to track if auto-loading has been attempted
  const [autoLoadAttempted, setAutoLoadAttempted] = useState<boolean>(false);

  // Embed refs for the ThoughtSpot pre-rendered embeds
  const liveboardEmbedRef = useEmbedRef<typeof LiveboardEmbed>();
  const spotterEmbedRef = useEmbedRef<typeof SpotterEmbed>();

  const [showChat, setShowChat] = useState<boolean>(false);
  const threadRef = useRef<Thread>();
  const clearMessages = useStore((state: any) => state.clearMessages);

  // Function to move the spotter embed to the front or back of the page
  const updateSpotterVisibility = useCallback(() => {
    let spotterEmbed: any = document.getElementById(
      "tsEmbed-pre-render-wrapper-spotterEmbed"
    );
    if (!spotterEmbed) return;
    if (showSpotter) {
      setTimeout(() => {
        spotterEmbed.style.zIndex = 20;
      }, 500);
    } else {
      spotterEmbed.style.zIndex = 0;
    }
  }, [showSpotter]);

  const startNewThread = useCallback(() => {
    if (!isLoggedIn) return;
    if (selectedPage?.subMenu?.worksheet) {
      threadRef.current = new Thread(
        selectedPage?.subMenu?.worksheet,
        settings.TSURL
      );
    } else {
      threadRef.current = new Thread(
        settings.subMenus[0]?.worksheet,
        settings.TSURL
      );
    }
    clearMessages();
  }, [
    isLoggedIn,
    selectedPage?.subMenu?.worksheet,
    settings.TSURL,
    settings.subMenus,
    clearMessages,
  ]);

  useEffect(() => {
    startNewThread();
  }, [showChat, startNewThread]);
  useEffect(() => {
    setSpotterLoaded(false);
    startNewThread();
  }, [selectedPage?.subMenu, startNewThread]);

  useEffect(() => {
    if (
      selectedThoughtSpotObject &&
      selectedThoughtSpotObject.type === ThoughtSpotObjectType.ANSWER
    ) {
      let searchEmbed: any = document.getElementById(
        "tsEmbed-pre-render-wrapper-searchEmbed"
      );
      if (!searchEmbed) return;

      //let navigateURL = "/embed/saved-answer/d8aac0c1-a33b-43da-b68f-afecfc91d8ce";
      let navigateURL = "embed/saved-answer/" + selectedThoughtSpotObject.uuid;
      console.log(navigateURL, "switching");
      searchEmbed.__tsEmbed.trigger(HostEvent.Navigate, navigateURL);
    }
  }, [selectedThoughtSpotObject]);
  // Function to reload the page when the user changes
  useEffect(() => {
    if (liveboardEmbedRef.current && user) {
      setSelectedPage({
        type: PageType.ANALYTICSHOME,
      });
      window.location.reload();
    }
  }, [user, liveboardEmbedRef, setSelectedPage]);

  // Update visiblity and listen for pin event when spotter is selected
  useEffect(() => {
    let spotterEmbed: any = document.getElementById(
      "tsEmbed-pre-render-wrapper-spotterEmbed"
    );
    if (!spotterEmbed) return;
    updateSpotterVisibility();
    if (spotterEmbed.__tsEmbed) {
      // Listen for the pin event and refresh the liveboard embed
      spotterEmbed.__tsEmbed.on(EmbedEvent.Pin, (data: any) => {
        let liveboardId = data.data.liveboardId;
        let liveboardEmbed: any = document.getElementById(
          "tsEmbed-pre-render-wrapper-liveboardEmbed"
        );
        liveboardEmbed.__tsEmbed.navigateToLiveboard("");
        liveboardEmbed.__tsEmbed.navigateToLiveboard(liveboardId);
      });
    }
  }, [showSpotter, updateSpotterVisibility]);

  // On page change, ensure spotter visibility is correct and update the pre-rendered embed
  useEffect(() => {
    updateSpotterVisibility();
    let spotterEmbed: any = document.getElementById(
      "tsEmbed-pre-render-wrapper-spotterEmbed"
    );
    if (!spotterEmbed) return;
    setTimeout(() => {
      spotterEmbed.__tsEmbed.syncPreRenderStyle();
    }, 500);
  }, [selectedPage, updateSpotterVisibility]);

  // On prompt change, update the spotter embed
  useEffect(() => {
    updateSpotterVisibility();
    if (spotterPrompt !== "") {
      setShowSpotter(true);
    }
    if (spotterPrompt !== "" && showSpotter && spotterEmbedRef.current) {
      console.log("editing last prompt", spotterPrompt);
      /*  TODO: This host event is not yet supported in the SDK.  Need to add this when it is supported.
      spotterEmbedRef.current.trigger(HostEvent.EditLastPrompt, {
        queryString: spotterPrompt,
      });
      */
    }
  }, [spotterPrompt, updateSpotterVisibility, showSpotter, spotterEmbedRef]);

  // Set document title and favicon from settings
  useEffect(() => {
    if (settings && settings.name) {
      document.title = settings.name;
    }
    
    if (settings && settings.logo && settings.logo.trim() !== '') {
      // Create inverted version of logo for favicon
      const createInvertedFavicon = (logoUrl: string) => {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Handle CORS if possible
        
        img.onload = () => {
          try {
            // Create canvas to manipulate the image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) return;
            
            // Set canvas size to match image (or standardize to 32x32 for favicon)
            canvas.width = 32;
            canvas.height = 32;
            
            // Draw only the first 100px of the image onto canvas (cropped and scaled to 32x32)
            // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
            // sx=0, sy=0: start from top-left of source image
            // sWidth=100: take only first 100px width from source
            // sHeight=img.height: take full height from source
            // dx=0, dy=0: place at top-left of canvas
            // dWidth=32, dHeight=32: scale to fill entire 32x32 canvas
            const cropWidth = Math.min(154, img.width); // Don't crop more than image width
            ctx.drawImage(img, 0, 0, cropWidth, img.height, 0, 0, 32, 32);
            
            // Get image data to manipulate pixels
            const imageData = ctx.getImageData(0, 0, 32, 32);
            const data = imageData.data;
            
            // Invert colors (skip alpha channel)
            for (let i = 0; i < data.length; i += 4) {
              data[i] = 255 - data[i];     // Red
              data[i + 1] = 255 - data[i + 1]; // Green
              data[i + 2] = 255 - data[i + 2]; // Blue
              // data[i + 3] is alpha, leave unchanged
            }
            
            // Put the modified image data back
            ctx.putImageData(imageData, 0, 0);
            
            // Convert canvas to data URL
            const invertedDataUrl = canvas.toDataURL('image/png');
            
            // Update favicon with inverted image
            let favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
            if (favicon) {
              favicon.href = invertedDataUrl;
            } else {
              // Create favicon link if it doesn't exist
              favicon = document.createElement('link');
              favicon.rel = 'icon';
              favicon.href = invertedDataUrl;
              document.head.appendChild(favicon);
            }
            
            // Update apple-touch-icon with inverted image
            let appleFavicon = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
            if (appleFavicon) {
              appleFavicon.href = invertedDataUrl;
            }
          } catch (error) {
            console.log('Could not create inverted favicon due to CORS, using original logo');
            // Fallback to original logo if CORS or other issues
            let favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
            if (favicon) {
              favicon.href = logoUrl;
            } else {
              favicon = document.createElement('link');
              favicon.rel = 'icon';
              favicon.href = logoUrl;
              document.head.appendChild(favicon);
            }
          }
        };
        
        img.onerror = () => {
          console.log('Could not load logo image, keeping default favicon');
        };
        
        img.src = logoUrl;
      };
      
      createInvertedFavicon(settings.logo);
    }
  }, [settings.name, settings.logo]);

  // Get the settings from the URL path if it exists
  useEffect(() => {
    //get route from url
    let path = window.location.pathname;
    path = CleanPath(path);
    if (path !== "") {
      GetAvailableDemos().then((demos) => {
        for (let i = 0; i < demos.length; i++) {
          if (CleanPath(demos[i].path) === path) {
            GetDemo(demos[i].path).then((demo) => {
              setSettings(demo);
            });
          }
        }
      });
    }
    if (!settings || !settings.style || !settings.style.headerColor) {
      setSettings(defaultSettings);
    }
  }, [settings, setSettings]);

  // Auto-load Nexora configuration on first startup
  useEffect(() => {
    // Only attempt auto-loading once and only if we haven't tried before
    if (autoLoadAttempted) return;
    
    // Check if we're using default settings (first time loading)
    const isDefaultSettings = !settings || 
      !settings.TSURL || 
      settings.TSURL === "" || 
      settings === defaultSettings ||
      (settings.style && settings.style.headerColor === defaultSettings.style.headerColor);
    
    if (isDefaultSettings) {
      setAutoLoadAttempted(true);
      // Automatically load Nexora.txt configuration
      GetDemo("Nexora.txt").then((nexoraConfig) => {
        console.log("Auto-loading Nexora configuration...");
        setSettings(nexoraConfig);
      }).catch((error) => {
        console.error("Failed to auto-load Nexora configuration:", error);
        // Fallback to default settings if Nexora.txt fails to load
        setSettings(defaultSettings);
      });
    }
  }, [settings, setSettings, autoLoadAttempted]); // Include dependencies to ensure proper execution

  // Initialize the ThoughtSpot SDK when the settings are loaded
  useEffect(() => {
    if (!settings || !settings.TSURL) {
      return;
    }

    // Initialize the ThoughtSpot SDK
    // Current using AuthType.None for no authentication
    console.log(stringToFlags(settings.tsFlags), "tsflags");
    init({
      thoughtSpotHost: settings.TSURL,
      authType: AuthType.None,
      logLevel: LogLevel.ERROR,
      additionalFlags:
        settings.tsFlags && settings.tsFlags.length > 0
          ? stringToFlags(settings.tsFlags)
          : {},
      customizations: {
        style: {
          customCSSUrl:
            "https://cdn.jsdelivr.net/gh/hannsta/general@latest/fonts2.css",
          customCSS: CSSOverrides(settings) as customCssInterface,
        },
        content: {
          strings: StringOverrides(settings) || {},
        },
        iconSpriteUrl: IconSpriteOverrides(settings),
      },
      // On successful login - note this will only be executed when the liveboard is displayed so we first have to test with API call below.
    })
      .on(AuthStatus.SUCCESS, () => {
        setLoginPopupVisible(false);
        setIsLoggedIn(true);
      })
      .on(AuthStatus.FAILURE, (error) => {
        console.error("Error logging in", error);
      });
    //test existing login with rest API call
    try {
      let client = createClientWithoutAuth(settings.TSURL);
      client
        .getSystemInformation()
        .then((data: any) => {
          setIsLoggedIn(true);
        })
        .catch((error: any) => {
          console.log("Not logged in yet");
        });
    } catch (e: any) {
      console.log("Not Logged In Yet");
    }
  }, [settings]);

  // If settings are not loaded, display a loading message
  if (!settings || !settings.style || !settings.style.headerColor) {
    return <div>Loading...</div>;
  }

  // Trigger the update runtime filters event on the liveboard embed
  const updateFilters = (runtimeFilters: RuntimeFilter[]) => {
    if (spotterEmbedRef.current) {
      // have to do it on the __tsembed object because the ref is broken for now.
      var element: any = document.querySelector(
        "#tsEmbed-pre-render-wrapper-liveboardEmbed"
      );
      if (element && element.__tsEmbed) {
        element.__tsEmbed.trigger(
          HostEvent.UpdateRuntimeFilters,
          runtimeFilters
        );
      }
    }
  };
  const presentMode = () => {
    setPresentModeVisible(true);
  };
  return (
    <TSLoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <SettingsContext.Provider value={{ settings, setSettings }}>
        <UserContext.Provider value={{ user, setUser }}>
          <div
            className="App"
            style={{
              fontFamily: settings.style
                ? '"' + settings.style.fontFamily + '", sans-serif'
                : "",
            }}
          >
            {/* Top Navigation */}
            <TopNav
              user={user}
              setUser={setUser}
              showSettings={showSettings}
              setShowSettings={setShowSettings}
              setSelectedPage={setSelectedPage}
              setSettings={setSettings}
              setLoginPopupVisible={setLoginPopupVisible}
              setShowSpotter={setShowSpotter}
            />
            {/* Spotter Popup */}
            {showSpotter && (
              <SpotterView
                setShowSpotter={setShowSpotter}
                setSpotterPrompt={setSpotterPrompt}
                selectedPage={selectedPage}
                spotterPrompt={spotterPrompt}
                spotterLoaded={spotterLoaded}
                setSpotterLoaded={setSpotterLoaded}
              />
            )}
            <div
              className="absolute flex flex-row"
              style={{
                height: "calc(100vh - 4rem)",
                width: "100vw",
                top: "4rem",
              }}
            >
              {/* Left Navigation */}
              <LeftNav
                settings={settings}
                setSelectedPage={setSelectedPage}
                showSettings={showSettings}
                setShowSettings={setShowSettings}
                setThoughtSpotObject={setSelectedThoughtSpotObject}
              />

              {/* Main Content */}
              <div
                className="absolute"
                style={{
                  left: "4rem",
                  width: "calc(100vw - 4rem)",
                  height: "calc(100vh - 4rem)",
                  overflow: "auto",
                }}
              >
                {/* Home Image Page */}
                {selectedPage &&
                  selectedPage.type === PageType.HOMEIMAGE &&
                  isLoggedIn && (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <img
                        src={settings.homeImage}
                        alt="home"
                        className="w-full"
                      />
                    </div>
                  )}

                {/* Analytics Home Page */}
                {selectedPage &&
                  selectedPage.type === PageType.ANALYTICSHOME &&
                  isLoggedIn && (
                    <HomePageView
                      setSpotterPrompt={setSpotterPrompt}
                      setShowSpotter={setShowSpotter}
                      setSelectedPage={setSelectedPage}
                      setThoughtSpotObject={setSelectedThoughtSpotObject}
                    />
                  )}
                {selectedPage &&
                  isLoggedIn &&
                  selectedPage.type !== PageType.ANALYTICSHOME &&
                  selectedPage.type !== PageType.HOMEIMAGE && (
                    <>
                      {/* Sub Menu Page */}
                      {selectedPage && selectedPage.subMenu && (
                        <SubMenuView
                          settings={settings}
                          subMenu={selectedPage.subMenu}
                          setThoughtSpotObject={setSelectedThoughtSpotObject}
                        />
                      )}

                      {/* My Reports and Favorites Pages */}
                      {selectedPage &&
                        selectedPage.type === PageType.MYREPORTS && (
                          <RestReportsList
                            settings={settings}
                            isMyReports={true}
                            setThoughtSpotObject={setSelectedThoughtSpotObject}
                          />
                        )}
                      {selectedPage &&
                        selectedPage.type === PageType.FAVORITES && (
                          <RestReportsList
                            settings={settings}
                            isMyReports={false}
                            setThoughtSpotObject={setSelectedThoughtSpotObject}
                          />
                        )}

                      <div
                        className="absolute flex flex-col"
                        style={
                          selectedPage.type !== PageType.SIMPLESPOTTER &&
                          selectedPage.type !== PageType.SIMPLESEARCH &&
                          selectedPage.type !== PageType.SIMPLEFULLAPP
                            ? {
                                overflow: "auto",
                                left: "15rem",
                                width: "calc(100vw - 19rem)",
                                height: "calc(100vh - 4rem)",
                              }
                            : { 
                                width: "100%", 
                                height: "100%", 
                                padding: "4rem",
                                backgroundColor: settings.style.backgroundColor
                              }
                        }
                      >
                        {/* ThoughtSpot Object View */}
                        {selectedThoughtSpotObject && isLoggedIn && (
                          <ThoughtSpotObjectView
                            user={user}
                            setShowSpotter={setShowSpotter}
                            updateFilters={updateFilters}
                            presentMode={presentMode}
                            settings={settings}
                            type={selectedPage?.type ? selectedPage.type : null}
                            subMenu={
                              selectedPage?.subMenu
                                ? selectedPage.subMenu
                                : null
                            }
                            thoughtSpotObject={selectedThoughtSpotObject}
                          />
                        )}
                        {selectedPage &&
                          selectedPage.type === PageType.SIMPLESPOTTER && (
                            <SimpleSpotterView
                              simpleSpotter={settings.simpleSpotter}
                            />
                          )}
                        {selectedPage &&
                          selectedPage.type === PageType.SIMPLESEARCH && (
                            <SimpleSearchView
                              simpleSearch={settings.simpleSearch}
                            />
                          )}
                        {selectedPage &&
                          selectedPage.type === PageType.SIMPLEFULLAPP && (
                            <SimpleFullAppView
                              simpleFullApp={settings.simpleFullApp}
                            />
                          )}
                        {/* Sub Menu Landing Page */}
                        {!selectedThoughtSpotObject &&
                          isLoggedIn &&
                          selectedPage?.subMenu && (
                            <div
                              style={{
                                backgroundColor: settings.style.backgroundColor,
                              }}
                              className="p-8 h-full"
                            >
                              <KPIChartView
                                subMenu={selectedPage?.subMenu}
                                setSpotterPrompt={setSpotterPrompt}
                                setShowSpotter={setShowSpotter}
                                setSelectedPage={setSelectedPage}
                                setThoughtSpotObject={
                                  setSelectedThoughtSpotObject
                                }
                              />
                              <SubMenuDetailsView
                                subMenu={selectedPage.subMenu}
                              />
                            </div>
                          )}
                      </div>
                    </>
                  )}
                {/* Not Logged In Page */}
                {!isLoggedIn && (
                  <div className="flex flex-col items-center space-y-4 justify-center w-full h-full">
                    {settings.TSURL && settings.TSURL !== "" ? (
                      <>
                        <div className="text-2xl font-bold">
                          Please login to your ThoughtSpot environment to view
                          content.
                        </div>
                        <div className="text-lg">{settings.TSURL}</div>
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          onClick={() => setLoginPopupVisible(true)}
                        >
                          Login
                        </button>
                      </>
                    ) : (
                      <FirstLoginWelcome
                        setSettings={setSettings}
                        setShowSettings={setShowSettings}
                      />
                    )}
                    {loginPopupVisible && (
                      <LoginPopup setLoginPopupVisible={setLoginPopupVisible} />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/*
            Generate the pre-rendered embeds for the liveboard and spotter embeds
            These are hidden and only used to pre-render the embeds before they are shown 
          */}
          {isLoggedIn && (
            <div className="z-0">
              <PreRenderedLiveboardEmbed
                key={user.name}
                ref={liveboardEmbedRef}
                visibleActions={
                  user.userRole.visibleActions
                    ? user.userRole.visibleActions
                    : undefined
                }
                //hiddenActions={user.userRole.hiddenActions ? user.userRole.hiddenActions : undefined}
                preRenderId="liveboardEmbed"
               // liveboardId="629866db-ad37-46a6-b485-45a128e34051"
                isLiveboardStylingAndGroupingEnabled={true}
                
               //  liveboardId={""} //selectedThoughtSpotObject?.type == ThoughtSpotObjectType.LIVEBOARD && selectedThoughtSpotObject?.uuid ? selectedThoughtSpotObject.uuid : ''
              />
              {/* <PreRenderedSearchEmbed
                answerId={''}//selectedThoughtSpotObject?.type == ThoughtSpotObjectType.ANSWER &&  selectedThoughtSpotObject?.uuid ? selectedThoughtSpotObject.uuid : ''
                ref={searchEmbedRef}
                dataSource={selectedPage?.subMenu ? selectedPage.subMenu.worksheet : ''} 
                preRenderId={'searchEmbed'}
                frameParams={{width:'100%',height:'100%'}}
            /> */}

              <PreRenderedConversationEmbed
                visibleActions={[
                  Action.Save,
                  Action.Pin,
                  Action.DrillDown,
                  Action.Explore,
                  Action.SpotIQAnalyze,
                  Action.Share,
                  Action.Download,
                  Action.AddFilter,
                ]}
                disableSourceSelection={true}
                worksheetId={
                  selectedPage?.subMenu
                    ? selectedPage.subMenu.worksheet
                    : settings.subMenus[0]
                    ? settings.subMenus[0].worksheet
                    : ""
                }
                ref={spotterEmbedRef}
                preRenderId="spotterEmbed"
                frameParams={{ width: "100%", height: "100%" }}
              />
            </div>
          )}
          {presentModeVisible && (
            <PresentMode
              setPresentModeVisible={setPresentModeVisible}
              liveboardId={
                selectedThoughtSpotObject?.type ===
                  ThoughtSpotObjectType.LIVEBOARD &&
                selectedThoughtSpotObject?.uuid
                  ? selectedThoughtSpotObject.uuid
                  : ""
              }
            />
          )}
          {isLoggedIn && !presentModeVisible && (
            <>
              {!showChat ? (
                <div
                  style={{
                    display: "flex",
                    position: "fixed",
                    bottom: 24,
                    right: 24,
                    zIndex: 9999,
                    width: 64,
                    height: 64,
                  }}
                >
                  <div
                    className="p-4"
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 100,
                      backgroundColor:
                        settings.style.headerColor !== "#ffffff"
                          ? settings.style.headerColor
                          : settings.style.userIconColor,
                    }}
                  >
                    <div
                      className="hover:cursor-pointer"
                      onClick={() => setShowChat(true)}
                    >
                      <ChatIcon />
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className=" bg-white border-2 shadow-md align-center flex-col"
                  style={{
                    display: "flex",
                    position: "fixed",
                    bottom: 24,
                    right: 24,
                    zIndex: 9999,
                    height: "calc(100vh - 8rem)",
                    width: 600,
                    borderRadius: 10,
                  }}
                >
                  <div
                    className="flex align-center items-center justify-between p-4 py-6"
                    style={{
                      height: "2rem",
                      background: settings.style.headerColor,
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                    }}
                  >
                    <div className="font-bold" style={{ color: "white" }}>
                      {settings.otherSettings?.bodyLessSpotterName
                        ? settings.otherSettings?.bodyLessSpotterName
                        : "My Analytics Assistant"}
                    </div>
                    <CloseButton onClick={() => setShowChat(false)} />
                  </div>
                  <div
                    className="p-4 hover:cursor-pointer"
                    style={{ height: "calc(100vh - 12rem)" }}
                  >
                    <Chat className="chat-container" threadRef={threadRef} />
                  </div>
                </div>
              )}
            </>
          )}
        </UserContext.Provider>
      </SettingsContext.Provider>
    </TSLoginContext.Provider>
  );
}

export default App;
const stringToFlags = (input: string): Record<string, boolean> => {
  if (input === undefined) return {};
  const lines = input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const result: Record<string, boolean> = {};
  for (const line of lines) {
    const [key, value] = line.split("=");
    if (key) result[key.trim()] = value?.trim()?.toLowerCase() === "true";
  }
  return result;
};
