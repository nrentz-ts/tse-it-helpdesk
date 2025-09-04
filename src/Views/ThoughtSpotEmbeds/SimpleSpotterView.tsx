import { SpotterEmbed, EmbedEvent, Action } from "@thoughtspot/visual-embed-sdk";

import { useContext, useEffect, useRef, useState } from "react";
import { SettingsContext } from "../../App";
import { SimpleSpotter } from "../../Settings/StandardMenus/SimpleSpotterConfig";
import CustomActionPopup from "../Popups/CustomActionPopup";

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
        console.log(data.data);
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
