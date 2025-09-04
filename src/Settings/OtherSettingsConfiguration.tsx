import React from "react";
import { TextInput } from "./Inputs/InputMenus";

interface OtherSettingsConfigurationProps {
  otherSettings: OtherSettings;
  setOtherSettings: (otherSettings: OtherSettings) => void;
}
export interface OtherSettings {
  tabSwitchFrequency: number;
  bodyLessSpotterName: string;
  spotterName: string;
}

const OtherSettingsConfiguration: React.FC<OtherSettingsConfigurationProps> = ({
  otherSettings,
  setOtherSettings,
}) => {
  return (
    <div className="flex flex-col space-y-2 ">
      <div className="flex flex-col space-y-2">
        <TextInput
          label={"Tab Switch Frequency (sec)"}
          value={
            otherSettings && otherSettings.tabSwitchFrequency
              ? otherSettings.tabSwitchFrequency.toString()
              : "30"
          }
          setValue={(val) => {
            setOtherSettings({
              ...otherSettings,
              tabSwitchFrequency: Number(val),
            });
          }}
        />
        <TextInput
          label={"Spotter Name"}
          value={
            otherSettings?.spotterName ? otherSettings?.spotterName : "Spotter"
          }
          setValue={(val) => {
            setOtherSettings({ ...otherSettings, spotterName: val });
          }}
        />
        <TextInput
          label={"Bodyless Spotter Name"}
          value={
            otherSettings?.bodyLessSpotterName
              ? otherSettings?.bodyLessSpotterName
              : "My Analytics Assistant"
          }
          setValue={(val) => {
            setOtherSettings({ ...otherSettings, bodyLessSpotterName: val });
          }}
        />
      </div>
    </div>
  );
};

export default OtherSettingsConfiguration;
