import {
  LiveboardEmbed,
  CustomActionsPosition,
  CustomActionTarget,
  RuntimeFilter,
  SearchEmbed,
  useEmbedRef,
} from "@thoughtspot/visual-embed-sdk/react";
import { Settings } from "../Settings/SettingsConfiguration";
import {
  ThoughtSpotObject,
  ThoughtSpotObjectType,
} from "../Settings/ThoughtSpotObjectConfiguration";
import { SubMenu } from "../Settings/SubMenuConfiguration";
import AttributeFilter from "./Filters/AttributeFilter";
import { useState } from "react";
import { PageType } from "../App";
import CustomActionPopup from "./Popups/CustomActionPopup";
import { User } from "../Settings/UserConfiguration";
import VizSelector, { Viz } from "./Popups/VizSelector";
import { HostEvent } from "@thoughtspot/visual-embed-sdk";
import { createClientWithoutAuth } from "../Util/Util";
import { FilterType } from "../Settings/FiltersConfiguration";
import DateFilter from "./Filters/DateFilter";
import { FaCog } from "react-icons/fa";
import { HiComputerDesktop } from "react-icons/hi2";
import { 
  extractSearchDataFromPayload, 
  openGoogleSearch, 
  extractJiraDataFromPayload, 
  openJiraTicketCreation 
} from "../Util/CustomActionsHelper";

interface ThoughtSpotObjectViewProps {
  user: User;
  thoughtSpotObject: ThoughtSpotObject;
  type: PageType | null;
  subMenu: SubMenu | null;
  settings: Settings;
  updateFilters: (runtimeFilters: RuntimeFilter[]) => void;
  presentMode: () => void;
  setShowSpotter: (showSpotter: boolean) => void;
}
const ThoughtSpotObjectView: React.FC<ThoughtSpotObjectViewProps> = ({
  user,
  thoughtSpotObject,
  type,
  subMenu,
  settings,
  updateFilters,
  presentMode,
  setShowSpotter,
}) => {
  const [customActionPopupVisible, setCustomActionPopupVisible] =
    useState<boolean>(false);
  const [customActionData, setCustomActionData] = useState<any>(null);
  const [vizSelectorVisible, setVizSelectorVisible] = useState<boolean>(false);
  const [moreOptionsVisible, setMoreOptionsVisible] = useState<boolean>(false);
  const lbRef = useEmbedRef<typeof LiveboardEmbed>();
  const PinViz = async (viz: Viz) => {
    let client = createClientWithoutAuth(settings.TSURL);
    client
      .exportMetadataTML({
        metadata: [
          {
            identifier: thoughtSpotObject.uuid,
          },
        ],
        export_fqn: true,
      })
      .then((response) => {
        let tml = JSON.parse(response[0].edoc);
        let vizTML = viz.tml;
        if (!tml.liveboard.visualizations)
          tml.liveboard.visualizations = [vizTML];
        else tml.liveboard.visualizations.push(vizTML);
        client
          .importMetadataTML({
            metadata_tmls: [JSON.stringify(tml)],
          })
          .then((response) => {
            // Navigate to the liveboard using the embed ref
            if (lbRef.current) {
              lbRef.current.navigateToLiveboard("");
              lbRef.current.navigateToLiveboard(thoughtSpotObject.uuid);
            }
          });
      });
  };
  const updateRuntimeFilters = (runtimeFilters: RuntimeFilter[]) => {
    if (lbRef.current) {
      lbRef.current.trigger(HostEvent.UpdateRuntimeFilters, runtimeFilters);
    }
  };
  return (
    <div
      className={`flex flex-col w-full h-full ${
        type === PageType.ANALYTICS_DIRECT || type === PageType.MYREPORTS_DIRECT
          ? "pt-1 px-2 pb-2" // Minimal padding for direct page types - only 4px top padding
          : "p-8 space-y-2" // Full padding and spacing for submenu pages
      }`}
      style={{ background: settings.style.backgroundColor, overflow: "auto" }}
    >
      {/* Title section - show for all page types */}
      <div className={`${type === PageType.ANALYTICS_DIRECT || type === PageType.MYREPORTS_DIRECT ? "mb-1" : "mb-4"}`}>
        <div className={`flex flex-row items-center ${type === PageType.ANALYTICS_DIRECT || type === PageType.MYREPORTS_DIRECT ? "mb-1" : "mb-4"}`}>
          <div
            className="font-bold text-xl ml-6"
            style={{ color: settings.style.textColor }}
            dangerouslySetInnerHTML={{ __html: thoughtSpotObject.name }}
          ></div>
          {/* Settings gear - only show for non-direct page types */}
          {type !== PageType.ANALYTICS_DIRECT && type !== PageType.MYREPORTS_DIRECT && (
            <div
              className="text-gray-300 ml-2 hover:cursor-pointer"
              onClick={() => setMoreOptionsVisible(!moreOptionsVisible)}
            >
              <FaCog></FaCog>
            </div>
          )}
          {moreOptionsVisible && (
            <div className="flex flex-row ml-2 space-x-2">
              <div
                className="text-gray-300 ml-2 hover:cursor-pointer"
                onClick={presentMode}
              >
                <HiComputerDesktop></HiComputerDesktop>
              </div>
            </div>
          )}
        </div>
        {/* Filters and buttons - only show for non-direct page types */}
        {type !== PageType.ANALYTICS_DIRECT && type !== PageType.MYREPORTS_DIRECT && (
          <>
            {subMenu?.filters && subMenu.filters.length > 0 && (
              <div className="flex flex-col space-y-2  mb-4">
                <div className="flex flex-row space-x-2">
                  {subMenu.filters.map((filter, index) => {
                    return (
                      <>
                        {filter.type === FilterType.ATTRIBUTE && (
                          <AttributeFilter
                            key={index}
                            filter={filter}
                            worksheet={subMenu.worksheet}
                            settings={settings}
                            setFilter={(filter) => updateRuntimeFilters([filter])}
                          />
                        )}
                        {filter.type === FilterType.DATE && (
                          <DateFilter
                            key={index}
                            filter={filter}
                            worksheet={subMenu.worksheet}
                            settings={settings}
                            setFilter={(filter) => updateRuntimeFilters([filter])}
                          />
                        )}
                      </>
                    );
                  })}
                </div>
              </div>
            )}
            {type === PageType.MYREPORTS && (
              <>
                <button
                  className="w-36 bg-gray-200 hover:bg-gray-400 text-black hover:text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    setShowSpotter(true);
                  }}
                >
                  Create a Viz
                </button>
                <button
                  className="w-36 bg-gray-200 hover:bg-gray-400 text-black hover:text-white font-bold py-2 px-4 rounded ml-2"
                  onClick={() => {
                    setVizSelectorVisible(true);
                  }}
                >
                  Add a Viz
                </button>
              </>
            )}
          </>
        )}
      </div>
      {thoughtSpotObject.type === ThoughtSpotObjectType.LIVEBOARD && (
        <LiveboardEmbed
          ref={lbRef}
          isLiveboardCompactHeaderEnabled={true}
          hiddenActions={
            user.userRole.hiddenActions
              ? user.userRole.hiddenActions
              : undefined
          }
          visibleActions={
            user.userRole.visibleActions
              ? user.userRole.visibleActions
              : undefined
          }
          customActions={[
            {
              id: 'cbca-google-search',
              name: 'Google Search',
              position: CustomActionsPosition.CONTEXTMENU,
              target: CustomActionTarget.VIZ,
              dataModelIds: {
                modelColumnNames: ['4abeac87-b706-4107-8b84-7e7087a2fee0::state']
              }
            },
            {
              id: 'jira-custom-action',
              name: 'Log Jira Issue',
              position: CustomActionsPosition.CONTEXTMENU,
              target: CustomActionTarget.VIZ,
            },
          ]}
          onCustomAction={(data: any) => {
            console.log('🎯 Custom Action event triggered:', data);
            
            // Handle the Google search custom action
            const googleSearchActionId = 'cbca-google-search';
            if (data.data?.id === googleSearchActionId) {
              // Ensure popup is closed and data is cleared
              setCustomActionPopupVisible(false);
              setCustomActionData(null);
              
              // Extract data from the payload for Google search
              const searchData = extractSearchDataFromPayload(data.data);
              
              if (searchData) {
                // Open Google search in a new tab
                openGoogleSearch(searchData);
              } else {
                alert('No data found to search. Please try clicking on a data point first.');
              }
              return;
            }
            
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
            setCustomActionData(data.data);
            setCustomActionPopupVisible(true);
          }}
          
          
          liveboardId={thoughtSpotObject.uuid}
//isLiveboardStylingAndGroupingEnabled={true}
          frameParams={{ width: "100%", height: "100%" }}
        />
      )}
      {thoughtSpotObject.type === ThoughtSpotObjectType.ANSWER && (
        <SearchEmbed
          hiddenActions={user.userRole.hiddenActions}
          visibleActions={user.userRole.visibleActions}
          dataPanelV2={true}
          onCustomAction={(data: any) => {
            console.log('🎯 Custom Action event triggered (SearchEmbed):', data);
            
            // Handle the Google search custom action
            const googleSearchActionId = 'cbca-google-search';
            if (data.data?.id === googleSearchActionId) {
              // Ensure popup is closed and data is cleared
              setCustomActionPopupVisible(false);
              setCustomActionData(null);
              
              // Extract data from the payload for Google search
              const searchData = extractSearchDataFromPayload(data.data);
              
              if (searchData) {
                // Open Google search in a new tab
                openGoogleSearch(searchData);
              } else {
                alert('No data found to search. Please try clicking on a data point first.');
              }
              return;
            }
            
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
            console.log('📋 Default custom action handler (SearchEmbed):', data);
            setCustomActionData(data);
            setCustomActionPopupVisible(true);
          }}
          answerId={thoughtSpotObject.uuid}
          frameParams={{ width: "100%", height: "100%" }}
        />
      )}
      {customActionPopupVisible && customActionData && (
        <CustomActionPopup
          data={customActionData}
          closePopup={() => setCustomActionPopupVisible(false)}
        />
      )}
      {vizSelectorVisible && (
        <VizSelector
          liveboardId={settings.myReports.liveboardId}
          setVizId={PinViz}
          setVizSelectorVisible={setVizSelectorVisible}
        />
      )}
    </div>
  );
};
export default ThoughtSpotObjectView;
