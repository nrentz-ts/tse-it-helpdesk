import React from "react";
import { Page, SettingsContext, UserContext } from "../App";
import { ThoughtSpotObject } from "../Settings/ThoughtSpotObjectConfiguration";
import { 
  FiPlus, 
  FiCalendar, 
  FiTarget, 
  FiGlobe, 
  FiBarChart, 
  FiPlay
} from "react-icons/fi";
import { HiRocketLaunch, HiUsers, HiStar } from "react-icons/hi2";

interface HomePageViewProps {
  setSpotterPrompt: (prompt: string) => void;
  setShowSpotter: (show: boolean) => void;
  setSelectedPage: (page: Page) => void;
  setThoughtSpotObject: (thoughtSpotObject: ThoughtSpotObject) => void;
}

const HomePageView: React.FC<HomePageViewProps> = ({
  setSpotterPrompt,
  setShowSpotter,
  setSelectedPage,
  setThoughtSpotObject,
}) => {
  const BRAND_COLOR = "#08072D";
  
  // Helper functions to calculate dynamic dates
  const formatDate = (date: Date): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };
  
  const getLaunchDate = (): string => {
    const date = new Date();
    date.setDate(date.getDate() - 10);
    return `Launched ${formatDate(date)}`;
  };
  
  const getEndDate = (): string => {
    const date = new Date();
    date.setDate(date.getDate() - 13);
    return `Ended ${formatDate(date)}`;
  };
  
  const getStartDate = (): string => {
    const date = new Date();
    date.setDate(date.getDate() + 4);
    return `Starts ${formatDate(date)}`;
  };
  
  return (
    <SettingsContext.Consumer>
      {({ settings }) => (
        <UserContext.Consumer>
          {({ user }) => {
            return (
              <div className="min-h-screen" style={{ backgroundColor: settings.style.backgroundColor }}>
                {/* Header Section - Light Theme with Brand Accents */}
                <section className="py-8" style={{ backgroundColor: settings.style.backgroundColor }}>
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                      <div>
                        <h1 className="text-3xl font-bold mb-2" style={{ color: settings.style.textColor }}>Welcome back, {user.name}</h1>
                        <p className="text-gray-600">Here's what's happening with your marketing campaigns today.</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button className="font-medium px-4 py-2 rounded-lg flex items-center transition-colors hover:opacity-90" style={{ backgroundColor: settings.style.headerColor, color: settings.style.headerTextColor }}>
                          <FiPlus className="h-4 w-4 mr-2" style={{ color: settings.style.headerTextColor }} />
                          New Campaign
                        </button>
                        <button className="px-4 py-2 rounded-lg flex items-center transition-colors hover:opacity-80" style={{ color: BRAND_COLOR, backgroundColor: '#ECECEC', border: '1px solid #ECECEC' }}>
                          <FiCalendar className="h-4 w-4 mr-2" />
                          Schedule Meeting
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Main Content - Light Theme */}
                <section className="pb-8" style={{ backgroundColor: settings.style.backgroundColor }}>
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                      {/* Main Content Area */}
                      <div className="lg:col-span-2 space-y-6">
                        {/* Recent Campaigns Card */}
                        <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                              <h2 className="text-xl font-semibold text-gray-900">Recent Campaigns</h2>
                              <button className="text-sm font-medium px-3 py-1 rounded-md transition-colors hover:opacity-80" style={{ color: BRAND_COLOR, backgroundColor: `${BRAND_COLOR}15` }}>
                                View All
                              </button>
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center space-x-4">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500">
                                    <HiRocketLaunch className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Q4 Product Launch</h4>
                                    <p className="text-sm text-gray-500">Email • Social • Display</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                  </span>
                                  <p className="text-sm text-gray-500 mt-1">{getLaunchDate()}</p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center space-x-4">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500">
                                    <HiUsers className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Customer Retention Drive</h4>
                                    <p className="text-sm text-gray-500">Email • Push • In-app</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Completed
                                  </span>
                                  <p className="text-sm text-gray-500 mt-1">{getEndDate()}</p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center space-x-4">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500">
                                    <HiStar className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Holiday Sale Campaign</h4>
                                    <p className="text-sm text-gray-500">Omnichannel</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border">
                                    Scheduled
                                  </span>
                                  <p className="text-sm text-gray-500 mt-1">{getStartDate()}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Actions Card */}
                        <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                          <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Quick Actions</h2>
                            <p className="text-gray-600 mb-6">Jump into your most common marketing tasks</p>
                            <div className="grid md:grid-cols-2 gap-4">
                              <button className="h-auto p-4 text-left bg-green-50 hover:bg-green-100 border border-green-200 hover:border-green-300 rounded-lg transition-all shadow-sm hover:shadow-md">
                                <div className="flex items-center">
                                  <FiTarget className="h-5 w-5 mr-3 text-green-600" />
                                  <div>
                                    <div className="font-medium">Create Campaign</div>
                                    <div className="text-sm text-gray-600">Start a new marketing campaign</div>
                                  </div>
                                </div>
                              </button>

                              <button className="h-auto p-4 text-left bg-pink-50 hover:bg-pink-100 border border-pink-200 hover:border-pink-300 rounded-lg transition-all shadow-sm hover:shadow-md">
                                <div className="flex items-center">
                                  <HiUsers className="h-5 w-5 mr-3 text-pink-600" />
                                  <div>
                                    <div className="font-medium">Build Audience</div>
                                    <div className="text-sm text-gray-600">Create targeted segments</div>
                                  </div>
                                </div>
                              </button>

                              <button className="h-auto p-4 text-left bg-purple-50 hover:bg-purple-100 border border-purple-200 hover:border-purple-300 rounded-lg transition-all shadow-sm hover:shadow-md">
                                <div className="flex items-center">
                                  <FiBarChart className="h-5 w-5 mr-3 text-purple-600" />
                                  <div>
                                    <div className="font-medium">View Analytics</div>
                                    <div className="text-sm text-gray-600">Analyze campaign performance</div>
                                  </div>
                                </div>
                              </button>

                              <button className="h-auto p-4 text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-lg transition-all shadow-sm hover:shadow-md">
                                <div className="flex items-center">
                                  <FiPlay className="h-5 w-5 mr-3 text-gray-600" />
                                  <div>
                                    <div className="font-medium">A/B Test</div>
                                    <div className="text-sm text-gray-600">Optimize your campaigns</div>
                                  </div>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sidebar */}
                      <div className="space-y-6">
                        {/* Upcoming Tasks */}
                        <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                          <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks</h3>
                            <div className="space-y-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: BRAND_COLOR }}></div>
                                <div>
                                  <p className="text-sm font-medium">Campaign Review</p>
                                  <p className="text-xs text-gray-500">2:00 PM - 3:00 PM</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                <div>
                                  <p className="text-sm font-medium">Content Approval</p>
                                  <p className="text-xs text-gray-500">4:30 PM - 5:30 PM</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <div>
                                  <p className="text-sm font-medium">Launch Preparation</p>
                                  <p className="text-xs text-gray-500">Tomorrow 10:00 AM</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Recent Updates */}
                        <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                          <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Updates</h3>
                            <div className="space-y-3">
                              <div className="flex items-start space-x-3">
                                <FiTarget className="h-4 w-4 mt-0.5" style={{ color: BRAND_COLOR }} />
                                <div>
                                  <p className="text-sm font-medium">Campaign approved</p>
                                  <p className="text-xs text-gray-500">Q4 launch ready to go live</p>
                                </div>
                              </div>
                              <div className="flex items-start space-x-3">
                                <HiUsers className="h-4 w-4 text-green-500 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium">New team member added</p>
                                  <p className="text-xs text-gray-500">Alex joined the design team</p>
                                </div>
                              </div>
                              <div className="flex items-start space-x-3">
                                <FiGlobe className="h-4 w-4 text-purple-500 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium">Assets uploaded</p>
                                  <p className="text-xs text-gray-500">15 new creative assets available</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Team Activity */}
                        <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                          <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Activity</h3>
                            <div className="space-y-3">
                              <div className="flex items-center space-x-3">
                                <div
                                  className="w-6 h-6 rounded-full flex items-center justify-center"
                                  style={{ backgroundColor: BRAND_COLOR }}
                                >
                                  <span className="text-xs font-medium text-white">SM</span>
                                </div>
                                <div>
                                  <p className="text-sm">Sarah updated Q4 campaign</p>
                                  <p className="text-xs text-gray-500">2 hours ago</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div
                                  className="w-6 h-6 rounded-full flex items-center justify-center"
                                  style={{ backgroundColor: BRAND_COLOR }}
                                >
                                  <span className="text-xs font-medium text-white">MK</span>
                                </div>
                                <div>
                                  <p className="text-sm">Mike created new audience</p>
                                  <p className="text-xs text-gray-500">4 hours ago</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            );
          }}
        </UserContext.Consumer>
      )}
    </SettingsContext.Consumer>
  );
};

export default HomePageView;
