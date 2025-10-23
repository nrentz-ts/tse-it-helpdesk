import { Page, SettingsContext } from "../App";
import { SpotterEmbed, CustomActionsPosition, CustomActionTarget } from "@thoughtspot/visual-embed-sdk/react";
import { createRef, useEffect, useState } from "react";
import { CloseButton } from "../Settings/Inputs/InputMenus";
import CustomActionPopup from "./Popups/CustomActionPopup";
import { extractJiraDataFromPayload, openJiraTicketCreation } from "../Util/CustomActionsHelper";

interface SpotterViewProps {
  setShowSpotter: (show: boolean) => void;
  setSpotterPrompt: (prompt: string) => void;
  setSpotterLoaded: (loaded: boolean) => void;
  spotterLoaded: boolean;
  selectedPage: Page | null;
  spotterPrompt: string;
}
const SpotterView = ({
  setShowSpotter,
  setSpotterPrompt,
  selectedPage,
  spotterPrompt,
  spotterLoaded,
  setSpotterLoaded,
}: SpotterViewProps) => {
  const ref = createRef<HTMLDivElement>();
  const [customActionPopupVisible, setCustomActionPopupVisible] = useState<boolean>(false);
  const [customActionData, setCustomActionData] = useState<any>(null);
  // Removed pre-render wrapper logic - embeds will load normally
  return (
    <SettingsContext.Consumer>
      {({ settings }) => (
        <div
          ref={ref}
          className="absolute bg-white top-0 right-0 flex flex-col p-2 z-20 overflow-auto"
          style={{
            height: spotterLoaded ? "calc(100vh - 4rem)" : "500px",
            marginTop: "4rem",
            width: "700px",
            borderLeft: "1px solid #cccccc",
            borderBottom: "1px solid #cccccc",
          }}
        >
          <div className="flex flex-col p-4">
            <div className="flex flex-row text-2xl hover:font-bold">
              <div className="font-bold text-lg mt-5 mb-2">
                Ask Spotter{" "}
                <span className="text-gray-400">
                  {selectedPage?.subMenu?.name}
                </span>
              </div>
              <div className="ml-auto">
                <CloseButton onClick={() => setShowSpotter(false)} />
              </div>
            </div>
          </div>
          <SpotterEmbed
            // TODO: Figure out how to get the status
            // onSpotterEmbedQuery={() => {
            //   setSpotterLoaded(true);
            // }}
            worksheetId={
              selectedPage?.subMenu
                ? selectedPage.subMenu.worksheet
                : settings.subMenus[0].worksheet
            }
            frameParams={{ width: "100%", height: "100%" }}
            searchOptions={{
              searchQuery: spotterPrompt,
              //executeSearch: true,
            }}
            customActions={[
              {
                id: 'jira-custom-action',
                name: 'Log Jira Issue',
                position: CustomActionsPosition.CONTEXTMENU,
                target: CustomActionTarget.SPOTTER,
              },
            ]}
            onCustomAction={(data: any) => {
              console.log('🎯 Custom Action event triggered (SpotterView):', data);
              
              // Handle the JIRA custom action
              const jiraActionId = 'jira-custom-action';
              if (data.data?.id === jiraActionId) {
                // Ensure popup is closed and data is cleared
                setCustomActionPopupVisible(false);
                setCustomActionData(null);
                
                // Extract data from the payload for JIRA ticket creation
                const jiraData = extractJiraDataFromPayload(data.data);
                
                if (jiraData) {
                  // Open JIRA ticket creation page in a new tab
                  openJiraTicketCreation(jiraData);
                } else {
                  alert('No data found to create JIRA ticket. Please try clicking on a data point first.');
                }
                return;
              }
              
              // Default behavior for other custom actions (show popup)
              console.log('📋 Default custom action handler (SpotterView):', data);
              setCustomActionData(data.data);
              setCustomActionPopupVisible(true);
            }}
          />
          {!spotterLoaded && (
            <div className="flex flex-col justify-center items-center p-4 mb-10">
              <div>Press "Enter" to ask Spotter a question</div>
              {selectedPage &&
                selectedPage.subMenu &&
                selectedPage.subMenu.spotter &&
                selectedPage.subMenu?.spotter.sampleQuestions.length > 0 && (
                  <div className="flex flex-col items-center justify-center">
                    <div className="font-bold text-md mb-2 mt-4">
                      Or Try a Sample Question
                    </div>
                    <div className="flex flex-col space-y-3">
                      {selectedPage.subMenu?.spotter.sampleQuestions.map(
                        (question, index) => (
                          <div
                            onClick={() => setSpotterPrompt(question)}
                            key={index}
                            className="flex flex-row items-center justify-between hover:cursor-pointer hover:text-blue-400"
                          >
                            {question}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          )}
          {/* <button onClick={()=>pinViz()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Pin Viz</button> */}
          {customActionPopupVisible && customActionData && (
            <CustomActionPopup
              data={customActionData}
              closePopup={() => setCustomActionPopupVisible(false)}
            />
          )}
        </div>
      )}
    </SettingsContext.Consumer>
  );
};
export default SpotterView;
