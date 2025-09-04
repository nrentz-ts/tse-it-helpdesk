import { useState } from "react";
import IconSelection from "../Inputs/IconSelection";
import { TextInput } from "../Inputs/InputMenus";
import ThoughtSpotObjectSearch from "../Inputs/ThoughtSpotObjectSearch";
import { ThoughtSpotObjectType } from "../ThoughtSpotObjectConfiguration";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { TSLoginContext } from "../../App";

export interface SimpleSpotter {
  enabled: boolean;
  worksheet: string;
  name: string;
  icon: string;
}

export interface SimpleSpotterConfigProps {
  simpleSpotter: SimpleSpotter;
  setSimpleSpotter: (simpleSpotter: SimpleSpotter) => void;
}

const SimpleSpotterConfig: React.FC<SimpleSpotterConfigProps> = ({
  simpleSpotter,
  setSimpleSpotter,
}) => {
  const [worksheetSearchVisible, setWorksheetSearchVisible] =
    useState<boolean>(false);

  if (!simpleSpotter) {
    return <div></div>;
  }
  return (
    <TSLoginContext.Consumer>
      {({ isLoggedIn }) => (
        <div
          className={
            (simpleSpotter.enabled ? "bg-white" : "bg-gray-200") +
            " flex flex-col space-y-2 rounded-lg p-2"
          }
        >
          <div className="flex flex-row space-x-4">
            <IconSelection
              selectedIcon={simpleSpotter.icon}
              setSelectedIcon={(icon) =>
                setSimpleSpotter({ ...simpleSpotter, icon })
              }
            />
            <TextInput
              label="Name"
              value={simpleSpotter.name}
              setValue={(name) => setSimpleSpotter({ ...simpleSpotter, name })}
            />
            <div className="flex flex-row mb-2">
              <TextInput
                label="Worksheet"
                value={simpleSpotter.worksheet}
                setValue={(worksheet) =>
                  setSimpleSpotter({ ...simpleSpotter, worksheet })
                }
              />
              <div className="flex flex-row items-end">
                <button
                  className={
                    (isLoggedIn
                      ? "bg-blue-500 hover:bg-blue-700"
                      : "bg-slate-400") +
                    " text-white font-bold h-8 px-4 rounded ml-2"
                  }
                  onClick={() =>
                    setWorksheetSearchVisible(!worksheetSearchVisible)
                  }
                  disabled={!isLoggedIn}
                >
                  <HiMagnifyingGlass />
                </button>
              </div>
            </div>
            {worksheetSearchVisible && (
              <ThoughtSpotObjectSearch
                type={ThoughtSpotObjectType.WORKSHEET}
                setObject={(object) => {
                  setSimpleSpotter({
                    ...simpleSpotter,
                    worksheet: object.uuid,
                  });
                  setWorksheetSearchVisible(false);
                }}
                closePopup={() => setWorksheetSearchVisible(false)}
              />
            )}
            <div className="flex flex-row w-full justify-end items-center">
              <div className="flex flex-col mr-8 text-slate-400 font-bold">
                Spotter
              </div>
              <button
                onClick={() => {
                  setSimpleSpotter({
                    ...simpleSpotter,
                    enabled: !simpleSpotter.enabled,
                  });
                }}
                className={
                  (simpleSpotter.enabled
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-300 hover:bg-gray-400") +
                  " w-24 h-10 text-white hover:text-white font-bold py-2 px-4 rounded"
                }
              >
                {simpleSpotter.enabled ? "Enabled" : "Disabled"}
              </button>
            </div>
          </div>
        </div>
      )}
    </TSLoginContext.Consumer>
  );
};
export default SimpleSpotterConfig;
