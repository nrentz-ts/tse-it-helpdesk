import { SpotterEmbed, EmbedEvent, Action, CustomActionsPosition, CustomActionTarget } from "@thoughtspot/visual-embed-sdk";

import { useContext, useEffect, useRef, useState } from "react";
import { SettingsContext } from "../../App";
import { SimpleSpotter } from "../../Settings/StandardMenus/SimpleSpotterConfig";
import CustomActionPopup from "../Popups/CustomActionPopup";
import { extractJiraDataFromPayload, openJiraTicketCreation, extractServiceNowDataFromPayload, openServiceNowIncidentCreation } from "../../Util/CustomActionsHelper";

interface SimpleSpotterProps {
  simpleSpotter: SimpleSpotter;
}
const SimpleSpotterView: React.FC<SimpleSpotterProps> = ({ simpleSpotter }) => {
  const settings = useContext(SettingsContext).settings;
  const embedRef = useRef<any>(null);
  const [customActionPopupVisible, setCustomActionPopupVisible] = useState<boolean>(false);
  const [customActionData, setCustomActionData] = useState<any>(null);
  useEffect(() => {
    let div = document.getElementById("spotter");
    if (div) {
      embedRef.current = new SpotterEmbed(div, {
        worksheetId: simpleSpotter.worksheet,
        frameParams: {
          width: "100%",
          height: "100%",
        },
        hiddenActions: [
          "send-to-hubspot" as Action,
          "send-to-slack" as Action,
          "create-jira" as Action,
        ],
        customActions: [
          {
            id: 'jira-custom-action',
            name: 'Jira',
            position: CustomActionsPosition.CONTEXTMENU,
            target: CustomActionTarget.SPOTTER,
          },
          {
            id: 'servicenow-custom-action',
            name: 'ServiceNow',
            position: CustomActionsPosition.CONTEXTMENU,
            target: CustomActionTarget.SPOTTER,
          },
        ],
        /*
        runtimeFilters: [
          {
            columnName: "Store Region",
            operator: RuntimeFilterOp.IN,
            values: ["east"],
          },
        ],
        */
        customizations: {
          iconSpriteUrl:
            "https://cdn.jsdelivr.net/gh/hannsta/ts-demo-builder@main/public/sparkleicon.svg",
          content: {
            strings: {
              Spotter: settings.otherSettings?.spotterName
                ? settings.otherSettings.spotterName
                : "Spotter",
            },
          },
          style: {
            customCSS: {
              rules_UNSTABLE: {
                ".zauthenticated-app-view-module__pageContent": {
                  overflow: "hidden",
                },
              },
            },
          },
        },
      });
      embedRef.current.render();
      embedRef.current.on(EmbedEvent.CustomAction, (data: any) => {
        console.log('🎯 Custom Action event triggered (SimpleSpotter):', data);
        
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
        
        // Handle the ServiceNow custom action
        const serviceNowActionId = 'servicenow-custom-action';
        if (data.data?.id === serviceNowActionId) {
          // Ensure popup is closed and data is cleared
          setCustomActionPopupVisible(false);
          setCustomActionData(null);
          
          // Extract data from the payload for ServiceNow incident creation
          const serviceNowData = extractServiceNowDataFromPayload(data.data);
          
          if (serviceNowData) {
            // Open ServiceNow incident creation page in a new tab
            openServiceNowIncidentCreation(serviceNowData);
          } else {
            alert('No data found to create ServiceNow incident. Please try clicking on a data point first.');
          }
          return;
        }
        
        // Default behavior for other custom actions (show popup)
        console.log('📋 Default custom action handler (SimpleSpotter):', data);
        setCustomActionData(data.data);
        setCustomActionPopupVisible(true);
      });
      embedRef.current.on(EmbedEvent.ALL, (data: any) => {
        console.log(data);
      });
    }
  }, [simpleSpotter.worksheet, settings.otherSettings?.spotterName]);
  return (
    <>
      {simpleSpotter.worksheet ? (
        <div className="h-full" id="spotter"></div>
      ) : (
        <div>Please select a worksheet in the Settings menu</div>
      )}
      {customActionPopupVisible && (
        <CustomActionPopup
          data={customActionData}
          closePopup={() => setCustomActionPopupVisible(false)}
        />
      )}
    </>
  );
};
export default SimpleSpotterView;
