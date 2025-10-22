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
                        <p className="text-gray-600">Here's what's happening with your IT HelpDesk today.</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button className="font-medium px-4 py-2 rounded-lg flex items-center transition-colors hover:opacity-90" style={{ backgroundColor: settings.style.headerColor, color: settings.style.headerTextColor }}>
                          <FiPlus className="h-4 w-4 mr-2" style={{ color: settings.style.headerTextColor }} />
                          New Ticket
                        </button>
                        <button className="px-4 py-2 rounded-lg flex items-center transition-colors hover:opacity-80" style={{ color: BRAND_COLOR, backgroundColor: '#ECECEC', border: '1px solid #ECECEC' }}>
                          <FiCalendar className="h-4 w-4 mr-2" />
                          Schedule Maintenance
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Main Content - Analytics Dashboard */}
                <section className="pb-8" style={{ backgroundColor: settings.style.backgroundColor }}>
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* System Status Bar */}
                    <div className="mb-6">
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-sm font-medium text-gray-700">All Systems Operational</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span className="text-sm font-medium text-gray-700">12 Active Tickets</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                              <span className="text-sm font-medium text-gray-700">2 Critical Issues</span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            Last updated: {new Date().toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Analytics Grid */}
                    <div className="grid lg:grid-cols-5 gap-6">
                      {/* Left Sidebar - Filters & Actions */}
                      <div className="lg:col-span-1 space-y-4">
                        {/* Quick Filters */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                          <div className="p-4 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-900">Quick Filters</h3>
                          </div>
                          <div className="p-4 space-y-2">
                            <button className="w-full text-left px-3 py-2 text-sm bg-red-50 text-red-700 rounded-md border border-red-200 hover:bg-red-100">
                              Critical (2)
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm bg-orange-50 text-orange-700 rounded-md border border-orange-200 hover:bg-orange-100">
                              High Priority (5)
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md border border-blue-200 hover:bg-blue-100">
                              In Progress (8)
                            </button>
                            <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-md border border-gray-200 hover:bg-gray-100">
                              Pending (12)
                            </button>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                          <div className="p-4 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-900">Actions</h3>
                          </div>
                          <div className="p-4 space-y-2">
                            <button className="w-full flex items-center px-3 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                              <FiTarget className="h-4 w-4 mr-2" />
                              New Ticket
                            </button>
                            <button className="w-full flex items-center px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                              <HiUsers className="h-4 w-4 mr-2" />
                              Add User
                            </button>
                            <button className="w-full flex items-center px-3 py-2 text-sm bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">
                              <FiBarChart className="h-4 w-4 mr-2" />
                              Reports
                            </button>
                          </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                          <div className="p-4 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-900">Performance</h3>
                          </div>
                          <div className="p-4 space-y-4">
                            <div>
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Response Time</span>
                                <span>2.3h avg</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Resolution Rate</span>
                                <span>94%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>SLA Compliance</span>
                                <span>98%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Main Content Area */}
                      <div className="lg:col-span-4 space-y-6">
                        {/* Key Metrics Row */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Total Tickets</p>
                                <p className="text-2xl font-bold text-gray-900">247</p>
                                <p className="text-xs text-green-600">+12% from last week</p>
                              </div>
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FiTarget className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Open Tickets</p>
                                <p className="text-2xl font-bold text-gray-900">12</p>
                                <p className="text-xs text-red-600">-3 from yesterday</p>
                              </div>
                              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <FiCalendar className="h-5 w-5 text-orange-600" />
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Avg Response</p>
                                <p className="text-2xl font-bold text-gray-900">2.3h</p>
                                <p className="text-xs text-green-600">-0.5h improvement</p>
                              </div>
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <FiGlobe className="h-5 w-5 text-green-600" />
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Active Users</p>
                                <p className="text-2xl font-bold text-gray-900">156</p>
                                <p className="text-xs text-blue-600">+8 new today</p>
                              </div>
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <HiUsers className="h-5 w-5 text-purple-600" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Ticket Queue */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                          <div className="px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                              <h2 className="text-lg font-semibold text-gray-900">Ticket Queue</h2>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">Sort by:</span>
                                <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                                  <option>Priority</option>
                                  <option>Created Date</option>
                                  <option>Assignee</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                <tr className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#1234</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Server Outage - Production</td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      Critical
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                      In Progress
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Sarah Miller</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getLaunchDate()}</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#1233</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Password Reset Request</td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                      Medium
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Resolved
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Mike Kim</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getEndDate()}</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#1232</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">VPN Access Request</td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      Low
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                      Pending
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Alex Lee</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getStartDate()}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Team Performance */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-100">
                              <h3 className="text-lg font-semibold text-gray-900">Team Performance</h3>
                            </div>
                            <div className="p-6">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                      <span className="text-xs font-medium text-green-800">SM</span>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Sarah Miller</p>
                                      <p className="text-xs text-gray-500">Senior Support</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">8 tickets</p>
                                    <p className="text-xs text-green-600">94% resolved</p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                      <span className="text-xs font-medium text-blue-800">MK</span>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Mike Kim</p>
                                      <p className="text-xs text-gray-500">Support Specialist</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">5 tickets</p>
                                    <p className="text-xs text-green-600">88% resolved</p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                      <span className="text-xs font-medium text-purple-800">AL</span>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Alex Lee</p>
                                      <p className="text-xs text-gray-500">Junior Support</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">3 tickets</p>
                                    <p className="text-xs text-orange-600">75% resolved</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-100">
                              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                            </div>
                            <div className="p-6">
                              <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-900">Ticket #1233 resolved</p>
                                    <p className="text-xs text-gray-500">Password reset completed • 2 hours ago</p>
                                  </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-900">New user onboarded</p>
                                    <p className="text-xs text-gray-500">Sarah Johnson added to AD • 4 hours ago</p>
                                  </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-900">System update deployed</p>
                                    <p className="text-xs text-gray-500">Security patches v2.1.3 • 6 hours ago</p>
                                  </div>
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
