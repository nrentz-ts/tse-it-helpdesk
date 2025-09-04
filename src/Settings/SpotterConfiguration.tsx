import { AddButton, RemoveButton, TextInput } from "./Inputs/InputMenus";

export interface Spotter {
  askSpotter: boolean;
  sampleQuestions: string[];
}

interface SpotterConfigurationProps {
  spotter: Spotter;
  setSpotter: (spotter: Spotter) => void;
}

const SpotterConfiguration: React.FC<SpotterConfigurationProps> = ({
  spotter,
  setSpotter,
}) => {
  // Safety check to prevent undefined errors
  if (!spotter) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col space-y-2 rounded-lg bg-white">
      <div className="flex flex-row space-x-4 w-full">
        <div className="flex flex-col">
          <div className="flex flex-row items-center mb-4">
            <label className="font-bold text-xl mr-2">Ask Spotter</label>
            <div className="flex flex-row  items-center">
              <input
                className="border-2 border-gray-200 h-6 w-6 rounded-lg bg-white m-2"
                type="checkbox"
                checked={spotter.askSpotter}
                onChange={(e) =>
                  setSpotter({ ...spotter, askSpotter: e.target.checked })
                }
              />
              <div
                className={
                  "text-lg " +
                  (spotter.askSpotter ? "text-green-400" : "text-gray-400")
                }
              >
                {spotter.askSpotter ? "Enabled" : "Disabled"}
              </div>
            </div>
          </div>
          {spotter.askSpotter && (
            <>
              <div className="flex flex-col space-y-2 mb-2">
                {spotter.askSpotter &&
                  spotter.sampleQuestions.map((question, index) => (
                    <div key={index} className="flex w-full flex-row">
                      <TextInput
                        label={"Sample Question " + (index + 1)}
                        value={question}
                        setValue={(question) => {
                          const updatedQuestions = [...spotter.sampleQuestions];
                          updatedQuestions[index] = question;
                          setSpotter({
                            ...spotter,
                            sampleQuestions: updatedQuestions,
                          });
                        }}
                      />
                      <RemoveButton
                        onClick={() => {
                          const updatedQuestions = [...spotter.sampleQuestions];
                          updatedQuestions.splice(index, 1);
                          setSpotter({
                            ...spotter,
                            sampleQuestions: updatedQuestions,
                          });
                        }}
                      />
                    </div>
                  ))}
              </div>
              <AddButton
                label="Add Question"
                onClick={() =>
                  setSpotter({
                    ...spotter,
                    sampleQuestions: [...spotter.sampleQuestions, ""],
                  })
                }
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default SpotterConfiguration;
